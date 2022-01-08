const multer = require('multer');
const User = require('./../models/user');

const multerStorage = multer.memoryStorage();

const upload = multer({
	storage: multerStorage,
	fileFilter(req, file, cb) {
		if (!file.mimetype.startsWith('image')) {
			cb(new Error('Not an image! Please upload an image'), false);
		}
		cb(null, true);
	}
});

exports.upload = upload;

exports.resizePhoto = async (req, res, next) => {
	try {
		if (!req.file) return next();

		req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

		await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toFile(`public/img/users/${req.file.filename}`);

		next();
	} catch (error) {
    console.log(error);
    next();
  }
};

//Update User
exports.updateMe = async (req, res, next) => {
	try {
		if (req.body && req.body.password) {
			throw new Error('You cannot update password here.');
		}
		const newObj = {};
		Object.keys(req.body).forEach(el => {
			if (el != 'password' && el != 'user') {
				newObj[el] = req.body[el];
			}
		});

		const url = `${req.protocol}://${req.get('host')}/public/img/users/${
			req.file.filename
		}`;
		if (req.file) newObj.photo = url;

		const updatedUser = await User.findByIdAndUpdate(req.user._id, newObj, {
			new: true,
			runValidators: true
		});

		res.status(200).json({
			username: updatedUser.name,
			photo: updatedUser.photo,
			email: updatedUser.email
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.getUser = async (req, res, next) => {
	try {
		// console.log(req.user)
		const user = req.user;
		res.status(200).json({
			username: user.name,
			photo: user.photo,
			email: user.email
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.getFriends = async (req, res, next) => {
	try {
		// console.log(req.user)
		const user = req.user;
		res.status(200).json({
			friends: user.friends.length
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

/** Admin Routes */
exports.getAllUsers = async (rea, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json({
			status: 'success',
			results: users.length,
			data: users
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'success'
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.follow = async (req, res, next) => {
	try {
		const user = req.user;
		const id = req.params.id;

		const userToFollow = await User.findById(id);
		// console.log(userToFollow);
		// let arr = userToFollow.followers.filter(el => {
		//   console.log(el.toString())
		//   return el.toString() === user.id
		// })
		// console.log(arr)
		if (userToFollow) {
			if (userToFollow.followers.find(el => el.toString() === user.id)) {
				// let index = userToFollow.followers.findIndex((el) => el.toString() === user.id);
				throw new Error('You already follow this user');
			} else {
				userToFollow.followers.unshift(user._id);
				await userToFollow.save();

				user.following.unshift(userToFollow._id);
				await user.save();

				res.status(200).json({
					status: 'success',
					msg: 'You have successfully followed the user'
				});
			}
		} else {
			throw new Error('This user no longer exist!');
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.unfollow = async (req, res, next) => {
	try {
		const user = req.user;
		const id = req.params.id;

		const userToUnFollow = await User.findById(id);
		if (userToUnFollow) {
			if (userToUnFollow.followers.find(el => el.toString() === user.id)) {
				let index1 = userToUnFollow.followers.findIndex(
					el => el.toString() === user.id
				);
				let index2 = user.following.findIndex(
					el => el.toString() === userToUnFollow.id
				);

				userToUnFollow.followers.splice(index1, 1);
				user.following.splice(index2, 1);
				await userToUnFollow.save();
				await user.save();

				res.status(200).json({
					status: 'success',
					msg: 'You have successfully unfollowed the user'
				});
			} else {
				throw new Error('You donot follow this user.');
			}
		} else {
			throw new Error('This user no longer exist!');
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};
