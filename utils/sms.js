const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const messagingServiceSid = process.env.MESSAGE_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

const sendMessage = ({ body, to }) => {
	client.messages
		.create({
			body,
      messagingServiceSid,
			to
		})
		.then(message => console.log(message.sid, 'Message sent successfully'))
		.catch(e => {
			console.log(e);
		});
};

module.exports = sendMessage;
