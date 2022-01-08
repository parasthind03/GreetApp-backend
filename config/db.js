const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log('Database connected...');
  } catch (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
