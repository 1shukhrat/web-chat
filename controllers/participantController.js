const {User, Participant, Room, Invite, Constraint} = require('../models/models');

class ParticipantController {

    async join(req, res) {
        const room = await Room.findByPk(req.body.roomId, {
            include: [
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
            return res.status(404).send({message: 'Room not found'});
        } else {
            const invite = await Invite.findOne({
                where: {
                    roomId: room.id,
                    userId: req.user.id
                }
            });
            if (invite) {

                const participant = await Participant.create({
                    userId: req.user.id,
                    roomId: room.id
                });

                participant.setConstraints(room.constraints);

                await participant.save();

                return res.status(200).send({participant});
            } else {
                return res.status(404).send({message: 'Invite not found'});
            }
        }
    }

    async leave(req, res) {
        const participant = await Participant.findOne({
           where: {
               userId: req.user.id,
               roomId: req.body.roomId
           }
       });
       if (participant) {
           await participant.destroy();
           return res.status(200).send({message: 'Participant left'});
       } else {
           return res.status(404).send({message: 'Participant not found'});
       }
    }

    async changeConstraints(req, res) {
        const room = await Room.findByPk(req.body.roomId);
        const participant = Participant.findByPk(req.body.participantId);
        const constraints = await Constraint.findAll({
            where: {
                name: req.body.constraints
            }
        });
        
        participant.setConstraints(constraints);
        await participant.save();
        return res.status(200).send(participant);
    }
}