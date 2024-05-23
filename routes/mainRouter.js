const router = new require('express').Router();
const userRouter = require('./userRouter');
const roomRouter = require('./roomRouter');

router.use('/users', userRouter);
router.use('/rooms', roomRouter);

module.exports = router;