const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: [true, 'Please provide a username']
		},
		email: {
			type: String,
			unique: true,
			match: [
				/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
				'Please enter a valid email address'
			],
			required: [true, 'Please provide an email']
		},
		password: {
			type: String,
			minlength: 8,
			required: [true, 'Please provide a password']
		},
		photo: {
			type: String,
			default: ''
		},
		isAdmin: {
			type: Boolean,
			default: false
		},
		mobileNo: String,
		friends: [{ type: mongoose.Schema.ObjectId, ref: 'Friend' }],
		followers: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User'
			}
		],
		following: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User'
			}
		],
		followers: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User'
			}
		],
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date
	},
	{
		timestamps: true
	}
);

// userSchema.pre(/^find/, function (next) {
// 	this.populate('friends').populate('following').populate('followers');
// 	next();
// });

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
