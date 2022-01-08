const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	event: {
		type: String,
		required: true
	},
	photo: {
		type: Number
	}
});

const friend = mongoose.model('Friend', friendSchema);
module.exports = friend;
