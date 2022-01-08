require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
// const cron = require('node-cron');

const sendNotifications = require('./controllers/notificationController');
const userRouter = require('./routes/user');
const friendRouter = require('./routes/friend');
const chatRouter = require('./routes/chat');

connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	// cors: {
	// 	origin: 'http://localhost:3000'
	// }
});

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cron.schedule('* */23 * * *', function () {
// 	console.log('Hello');
// 	sendNotifications();
// });

//Routes
app.use('/api/user', userRouter);
app.use('/api/friend', friendRouter);
app.use('/api/chat/', chatRouter);
app.get('/', (req, res) => {
	res.send('Hello');
});

const port = process.env.PORT || 8000;

io.on('connection', socket => {
	console.log('a user entered', socket.id);
	socket.on('sendMessage', data => {
		socket.to(data.id).emit('receiveMessage', data);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected', socket.id);
	});
});

const server = httpServer.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});

process.on('unhandledRejection', err => {
	console.log('UNHANDLED REJECTION! SHUTTING DOWN...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
