const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
// const { ensureAuth } = require('./../middleware/auth')

const router = express.Router();

// Authentication and Authourization
router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch(
	'/updateMe',
	authController.protect,
	userController.upload.single('photo'),
  userController.resizePhoto,
	userController.updateMe
);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/getUser', authController.protect, userController.getUser);
router.get('/getFriends', authController.protect, userController.getFriends);

router.get('/follow/:id', authController.protect, userController.follow);
router.get('/unfollow/:id', authController.protect, userController.unfollow);

// User Routes
// Only accessed by admin
// router.use(authController.protect)
// router.use(ensureAuth);
// router.route('/').get(userController.getAllUsers)
// router.route('/:id').get(userController.getUser).delete(userController.deleteUser)

module.exports = router;
