const dotenv = require('dotenv');
dotenv.config();

const config = {
  PORT: process.env.PORT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};

module.exports = config;
