const {Room, Participant, Constraint, Chat, Invite, User} = require('../models/models');
const {sequelize} = require('../db');

class RoomController {

    async getRoom(req, res) {
        const room = await Room.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'firstName', 'lastName']
                },
                {
                    model: Participant,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username', 'firstName', 'lastName']
                        },
                        {
                            model: Constraint,
                            attributes: ['name'],
                            through: { attributes: [] }
                        }
                    ]
                },
                {
                    model: Constraint,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (!room) {
            res.status(404).send({message: 'Комната не найдена'});
        } else {
            const participant = await Participant.findOne({
                where : {
                    user_id: req.user.id,
                    room_id: room.id
                }
            });
            if (!participant) {
                res.status(403).send({message: 'У вас нет доступа к этой комнате'});
            } else {
                return res.status(200).json(room);
            }
        }
    };

    async createRoom(req, res) {
        const t = await sequelize.transaction();
        try {
            const newRoom = await Room.create({
                user_id: req.user.id
            });
            if (req.body.constraints) {
                const constraints = await Constraint.findAll({
                    where: {
                        name: req.body.constraints
                    }
                });
                if (constraints.length === 0) {
                    return res.status(400).json({
                        message: 'Некорректное ограничение'
                    })
                } else {
                    await newRoom.setConstraints(constraints);
                }
            }
            const chat = await Chat.create({
                roomId: newRoom.id,
                messages: []
            });
            await Room.update({chat: chat._id.toString()}, {where: {id: newRoom.id}});
            await Participant.create({
                room_id: newRoom.id,
                user_id: req.user.id,
            });
            await t.commit();
            return res.status(201).json({
                message: 'Комната успешно создана',
                room: await Room.findByPk(newRoom.id, {include: [
                       {
                           model: Constraint,
                           attributes: ['name'],
                           through: {
                               attributes: []
                           }
                       }
                   ]}
                )  
            });
        } catch (err) {
            await t.rollback();
            console.log(err);
            return res.status(500).json({
                message: 'Ошибка при создании комнаты'
            })
        }
    };

    async deleteRoom(req, res) {
        const t = await sequelize.transaction();
        try {
            const room = await Room.findOne({
                where: {id: req.params.id, user_id: req.user.id}
            });
            if (!room) {
                return res.status(404).json({
                    message: 'Комната не найдена'
                })
            }
            await room.destroy();
            await Chat.deleteOne({roomId: room.id});
            t.commit();
            return res.status(200).json({
                message: 'Комната успешно удалена'
            });
        } catch (err) {
            await t.rollback();
            console.log(err);
            return res.status(500).json({
                message: 'Ошибка при удалении комнаты'
            });
        }
    };

    async join(req, res) {
        const invite = await Invite.findOne({
            where: {
                room_id: req.params.id,
                user_id: req.user.id,
                code : req.body.code
            }
        });
        if (!invite) {
            return res.status(404).send({message: 'Вы не приглашены в комнату'});
        } else {
            const room = await Room.findByPk(req.params.id, {
                include: [
                    {
                        model: Constraint,
                        attributes: ['name'],
                        through: {attributes: []}
                    },
                    {
                        model: Participant,
                        attributes: ['id'],
                        include: [
                            {
                                model: Constraint,
                                attributes: ['name'],
                                throug: {attributes: []}
                            },
                            {
                                model: User,
                                attributes: ['id', 'username', 'firstName', 'lastName']
                            }
                        ]
                    }
                ]
            });
            if (!room) {
                return res.status(404).send({message: 'Комната не найдена'});
            } else {
                const participant = await Participant.findOne({
                    where: {
                        room_id: req.params.id,
                        user_id: req.user.id
                    }
                });
                if (participant) {
                    return res.status(200).send({
                        message: 'С возвращением',
                        room: room,
                        you : participant
                    }); 
                } else {
                    const t = await sequelize.transaction();
                    try {
                        const participant = await Participant.create({
                            room_id: req.params.id,
                            user_id: req.user.id
                        });
                        await participant.setConstraints(room.Constraints);
                        t.commit();
                        return res.status(200).send({
                            message: 'Вы присоединились к комнате',
                            room: room,
                            you: participant
                        })
                    } catch (err) {
                        console.log(err);
                        t.rollback();
                        return res.status(500).json({
                            message: 'Ошибка при присоединении к комнате'
                        });
                    }
                    
                }    
            }
        }
    }
};

module.exports = new RoomController();
