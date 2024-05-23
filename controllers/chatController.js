const {Chat, Participant, Constraint} = require('../models/models');

class ChatController {
    
    async getChat(req, res) {
        const chat = await Chat.findOne({roomId : req.params.id});

        const participant = await Participant.findOne({where: {
               user_id: req.user.id,
               room_id: req.params.id
        }});

       if (!chat || !participant) {
           return res.status(404).json({
               message: 'Чат не найден'
           });
       }
       return res.status(200).json(chat);
    };

    async sendMessage(req, res) {
        const chat = await Chat.findOne({
                roomId: req.params.id
        });

        const participant = await Participant.findOne({
            where: {
               user_id: req.user.id,
               room_id: req.params.id
            },
            include : [
                {
                    model: Constraint,
                    attributes: ['name'],
                    through: {attributes: []}
                }
            ] 
        });

        if (!chat || !participant) {
            return res.status(404).json({
                message: 'Участник или чат не найден'
            });
        } else {
            if (participant.Constraints.map(c => c.name).find(c => c === 'CHAT')) {
                return res.status(403).json({
                    message: 'Участник не может писать в чат'
                });
            } else {
                const message = {
                    content: req.body.message,
                    sender: req.user.id,
                    date : new Date()
                }
                chat.messages.push(message);
        
                chat.save();
                return res.status(200).json({
                    messageInfo: 'Сообщение отправлено',
                    message: message
                });
            }

        }
        
    }

}   

module.exports = new ChatController();