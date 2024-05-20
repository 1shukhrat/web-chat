const {Chat} = require('../models/models');

class ChatController {
    
    async getChat(req, res) {
        const chat = await Chat.findOne({
           where: {
               roomId: req.params.id
           }
       });

       if (!chat) {
           return res.status(404).json({
               message: 'Chat not found'
           });
       }
       return res.status(200).json(chat);
    };

    async sendMessage(req, res) {
        
        const chat = await Chat.findOne({
            where: {
                roomId: req.params.id
            }
        });

        if (!chat) {
            return res.status(404).json({
                message: 'Chat not found'
            });
        }

        const message = {
            content: req.body.message,
            sender: req.user.id,
            date : new Date()
        }
        
        chat.messages.push(message);

        message.save();

        return res.status(200).json(message);
    }
}