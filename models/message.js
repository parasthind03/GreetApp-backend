const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		senderId: String,
		conversationId: String,
		message: String
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Message', messageSchema);
