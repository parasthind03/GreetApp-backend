const Conversation = require('../models/conversation');

exports.newConversation = async (req, res, next) => {
	try {
		const { senderId, receiverId } = req.body;
		const conv = new Conversation({
			members: [senderId, receiverId]
		});

		await conv.save();
		res.status(200).json(conv);
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

// exports.getConversation = async (req, res, next) => {
// 	try {
// 		const { convoId } = req.params;
// 		const conv = await Conversation.findByID(convoId);

// 		res.status(200).json(conv);
// 	} catch (error) {
// 		res.status(400).json({
// 			status: 'fail',
// 			msg: error.message
// 		});
// 	}
// };

exports.getAllConversations = async (req, res, next) => {
	try {
		const { userId } = req.params;
    const conv = await Conversation.find({
      members: {$in: [userId]}
    })
		res.status(200).json(conv);
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};
