const { model } = require('mongoose');
const {Invite, Room, User} = require('../models/models');

class InviteController {
    async getMyInvites(req, res) {
        const invites = await Invite.findAll({
            where: {
                user_id: req.user.id
            }}, {
                include: [
                    {
                        model: Room,
                        as: 'room',
                        attributes: ['id']
                    }
                ]
            }
        );
        return res.status(200).json(invites);
    };

    async getRoomInvites(req, res) {
        const room = await Room.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }},
        );
        if (!room) {
            return res.status(404).json({message: 'Комната не найдена'});
        } else {
            const invites = await Invite.findAll({
                where: {
                    room_id: room.id
                },
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'firstName','lastName']
                }]
            });
            return res.status(200).json(invites);
        }
    }
}

module.exports = new InviteController();