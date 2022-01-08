const Friend = require('./../models/friend');
const email = require('../utils/email');
const sendMessage = require('../utils/sms');

exports.getAllFriends = async (req, res, next) => {
	try {
		const friends = req.user.friends;

		res.status(200).json({
			status: 'success',
			length: friends.length,
			friends
		});
	} catch (error) {
		res.json(error);
	}
};

exports.addFriend = async (req, res, next) => {
	try {
		const { name, date, event } = req.body;
		const user = req.user;
		const newFriend = new Friend({
			name,
			date,
			event,
			photo: Math.floor(Math.random() * 5 + 1)
		});
		await newFriend.save();

		await user.friends.push(newFriend);
		await user.save();

		const dateofEvent = new Date(newFriend.date);
		const curr = new Date();
		const currDate = curr.getDate();
		const currMonth = curr.getMonth();
		if (dateofEvent.getDate() === currDate && dateofEvent.getMonth() === currMonth) {
			// console.log(
			// 	`Today is the ${newFriend.event} of the friend ${newFriend.name}.`
			// );
			await email('Wish', user, {
				title: `Friend's ${newFriend.event}`,
				friend: newFriend
			});
			if (user.mobileNo !== '') {
				await sendMessage({
					body: `Today is the ${newFriend.event} of the friend ${newFriend.name}. Wish them if yout haven't`,
					to: user.mobileNo
				});
			}
		}

		res.status(200).json({
			status: 'success',
			friend: newFriend
		});
	} catch (error) {
		res.json(error.message);
	}
};

exports.updateFriend = async (req, res, next) => {
	try {
		const friend = await Friend.findByIdAndUpdate(req.params.id, {
			$set: req.body
		});
		res.status(200).json({
			status: 'success',
			friend
		});
	} catch (error) {
		res.json(error.message);
	}
};

exports.deleteFriend = async (req, res, next) => {
	try {
		req.user.friends = req.user.friends.filter(el => el != req.params.id);
		await Friend.findByIdAndDelete(req.params.id);
		res.status(200).json({
			status: 'success',
			data: 'deleted successfully.'
		});
	} catch (error) {
		res.json(false);
	}
};
