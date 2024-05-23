const router = new require('express').Router();
const auth = require('../middlewares/authMiddleware');

const RoomController = require('../controllers/roomController');
const ParticipantController = require('../controllers/participantController');
const ChatController = require('../controllers/chatController');
const InviteController = require('../controllers/inviteController');

router.get('/:id', auth('USER','ADMIN', 'ORGANIZER'), RoomController.getRoom);
router.get('/:id/invites', auth('ADMIN', 'ORGANIZER'), InviteController.getRoomInvites);
router.post('/', auth('ADMIN', 'ORGANIZER'), RoomController.createRoom);
router.delete('/:id', auth('ADMIN', 'ORGANIZER'), RoomController.deleteRoom);
router.post('/:id/join', auth('USER','ADMIN', 'ORGANIZER'), RoomController.join);

router.patch('/:roomId/participants/:participantId', auth('ADMIN', 'ORGANIZER'), ParticipantController.changeConstraints);
router.post('/:roomId/participants/invite', auth('ADMIN', 'ORGANIZER'), ParticipantController.invite);
router.delete('/:roomId/participants/:participantId', auth('ADMIN', 'ORGANIZER'), ParticipantController.deleteParticipant);
router.get('/:roomId/participants', auth('ADMIN', 'ORGANIZER', 'USER'), ParticipantController.getParticipants);

router.get('/:id/chat', auth('ADMIN', 'ORGANIZER', 'USER'), ChatController.getChat);
router.post('/:id/chat/message', auth('ADMIN', 'ORGANIZER', 'USER'), ChatController.sendMessage);

module.exports = router;