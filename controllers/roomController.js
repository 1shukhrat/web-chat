const {Room, Participant, Chat, Constraint} = require('../models');

class RoomController {

    async getRoom(req, res) {
        const room = await Room.findById(req.params.id, {
            include: [
                {
                    model: Participant,
                    as: 'participants',
                    attributes: ['id', 'username', 'firstName', 'lastName']
                },
                {
                    model: Constraint,
                    as: 'constraints',
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }
        const ChatRoom = await Chat.find({roomId: room.id});
        return res.status(200).json({
            room : room,
            chat : ChatRoom        
        });
    };

    async createRoom(req, res) {
        const constraints = await Constraint.findAll({
            where: {
                name: req.body.constraints
            }
        });
        const newRoom = await Room.create({
            name: req.body.name,
            userId: req.body.user.id
        });
        newRoom.addConstraints(constraints);

        res.status(201).json({
            message: 'Room created',
            room: newRoom
        })
    }

    async deleteRoom(req, res) {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }
        await room.destroy();
        return res.status(200).json({
            message: 'Room deleted'
        });
    }

}
