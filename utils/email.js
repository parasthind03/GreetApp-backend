const nodemailer = require('nodemailer')
const pug = require('pug')

async function SendEmail(template, user, subject) {
	const to = user.email

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'greetingsapp15@gmail.com',
			pass: 'uqaezdlroviwrrwt'
		}
	})

	const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
		firstName: user.name,
		subject: subject
	})
	// Step 2
	let mailOptions = {
		from: `Greetings App <greetingsapp15@gmail.com>`,
		to: to,
		subject: subject.title,
		html
	}

	// Step 3
	await transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			return console.log(err)
		}
		return console.log('Email sent!!!')
	})
}

module.exports = SendEmail
