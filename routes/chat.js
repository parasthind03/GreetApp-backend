const express = require('express');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.get('/message/:convoId', messageController.getMessages);
router.post('/message', messageController.newMessage);

router.get('/conversation/:userId', conversationController.getAllConversations);
router.post('/conversation', conversationController.newConversation);

module.exports = router;