const express = require('express');
const friendController = require('../controllers/friendController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// router.use(protect)
router
	.route('/')
	.get(protect, friendController.getAllFriends)
	.post(protect, friendController.addFriend);

router
	.route('/:id')
	.put(friendController.updateFriend)
	.delete(protect, friendController.deleteFriend);

module.exports = router;
