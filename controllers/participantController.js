const {Participant, Room, Invite, Constraint, User} = require('../models/models');
const {generateAccessCode} = require('../utils');
const {sequelize} = require('../db');

class ParticipantController {
    async changeConstraints(req, res) {
        const room = await Room.findOne({
            where : {
                id : req.params.roomId,
                user_id: req.user.id
            }
        });
        const participant = await Participant.findOne({
            where : {
                id: req.params.participantId,
                room_id: req.params.roomId,
            }
        });
        if (!participant || !room) {
            return res.status(404).send('Комната или участник не найдены');
        } else {
            const constraints = await Constraint.findAll({
                where: {
                    name: req.body.constraints
                }
            });
            if (constraints.length === 0) {
                return res.status(404).send('Некорректные ограничения');
            } else {
                await participant.setConstraints(constraints);
                return res.status(200).send({
                    message: 'Данные участника успешно изменены',
                    participant : await Participant.findByPk(participant.id, {
                        include: [
                            {
                                model: Constraint,
                                attributes: ['name'],
                                through: {
                                    attributes: []
                                }
                            }
                        ]
                    })
                }); 
            }
        }  
    }

    async invite(req, res) {
        const room = await Room.findOne({
            where : {
                id : req.params.roomId,
                user_id: req.user.id
            }
        });
        const user = await User.findByPk(req.body.userId);
        if (!room || !user) {
            return res.status(404).send({
                message : 'Комната или пользователь не найдены'
            });
        } else {
            const invite = await Invite.create({
                room_id: room.id,
                user_id: user.id,
                code: generateAccessCode(5)
            });
            return res.status(200).send({
                message: 'Приглашение успешно отправлено',
                invite : await Invite.findByPk(invite.id, {include: [
                       {
                           model: User,
                           attributes: ['username']
                       },
                       {
                           model: Room,
                           attributes: ['id']
                       }
                   ]})   
            });
        }; 
    }

    async deleteParticipant(req, res) {
        const room = await Room.findOne({
            where : {
                id : req.params.roomId,
                user_id: req.user.id
            }
        });
        const participant = await Participant.findOne({
            where : {
                id: req.params.participantId,
                room_id: req.params.roomId,
            }
        });
        if (!participant ||!room) {
            return res.status(404).send('Комната или участник не найдены');
        } else {
            const t = await sequelize.transaction();
            try {
                await Participant.destroy({ where : {id: participant.id}});
                await Invite.destroy({ where : {user_id: participant.user_id}});
                t.commit();
                return res.status(200).send({message: 'Участник удален'});
            } catch (e) {
                console.log(e);
                t.rollback();
                return res.status(500).send('Ошибка при удалении участника');
            }
        }
    }

    async getParticipants(req, res) {
        const room = await Room.findOne({where : {
               id : req.params.roomId,
        }});
        const participant = await Participant.findOne({
            user_id : req.user.id,
            room_id: req.params.roomId,
        })
        if (!room || !participant) {   
            return res.status(404).json({
                message: 'Комната или участник не найдены'
            });
        } else {
            return res.status(200).send({
                participants: await Participant.findAll({
                    where: {
                        room_id: room.id
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username', 'firstName', 'lastName']
                        },
                        {
                            model: Constraint,
                            attributes: ['name'],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                })
            });
        
        }


    }
}

module.exports = new ParticipantController();