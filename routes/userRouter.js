const router = new require('express').Router();
const auth = require('../middlewares/authMiddleware');

const userController = require('../controllers/userController');
const InviteController = require('../controllers/inviteController');

router.get('/invites', auth('ADMIN', 'ORGANIZER', 'USER'), InviteController.getMyInvites);
router.post('/', auth("ADMIN"), userController.createUser);
router.delete('/:id', auth('ADMIN'), userController.deleteUser);
router.patch('/:id', auth('ADMIN'), userController.updateRole);
router.get('/', auth('ADMIN', 'ORGANIZER'), userController.getAllUsers);
router.get('/:id', auth('ADMIN', 'ORGANIZER'), userController.getUserById);
router.post('/login', userController.login);

module.exports = router;



