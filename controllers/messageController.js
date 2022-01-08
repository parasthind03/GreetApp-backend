const Message = require('../models/message');

exports.newMessage = async (req, res, next) => {
	try {
		const newmsg = new Message(req.body);

		await newmsg.save();
		res.status(200).json({
			status: 'success',
			msg: 'Message sent successfully',
			newmsg
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.getMessages = async (req, res, next) => {
	try {
		const { convoId } = req.params;

		const messages = await Message.find({ conversationId: convoId });

		res.status(200).json(messages);
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};
