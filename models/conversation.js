const mongoose = require('mongoose');

const convoSchema = new mongoose.Schema({
	members: {
		type: Array
	}
});

module.exports = mongoose.model('Conersation', convoSchema);
