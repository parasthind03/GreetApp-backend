const User = require('../models/user');
const email = require('../utils/email');
const sendMessage = require('../utils/sms');

const sendNotifications = async () => {
	try {
		const users = await User.find();
		users.forEach(user => {
			if (user.friends) {
				const friends = user.friends;
				friends.map(async friend => {
					// console.log(friend);
					const dateofEvent = new Date(friend.date);
					const curr = new Date();
					const currDate = curr.getDate();
					const currMonth = curr.getMonth();
					// console.log(dateofEvent.getDate())
					// console.log(currDate)
					if (
						dateofEvent.getDate() === currDate &&
						dateofEvent.getMonth() === currMonth
					) {
						// console.log(`Today is the ${friend.event} of the friend ${friend.name}.`)
						// await email(`${friend.event}`, friend, 'abcdefgh');
						await email('Wish', user, {
							title: `Friend's ${friend.event}`,
							friend
						});
						// console.log('email sent');
						if (user.mobileNo !== '') {
							await sendMessage({
								body: `Today is the ${friend.event} of the friend ${friend.name}. Wish them if yout haven't`,
								to: user.mobileNo
							});
						}
					}
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = sendNotifications;
