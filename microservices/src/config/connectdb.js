const mongoose = require('mongoose');

// Use localhost for local development, Docker service name for containerized environment
const url = process.env.NODE_ENV === 'production' 
  ? "mongodb://chat_user:chat_pass@mongodb:27017/eccommerce?authSource=admin"
  : "mongodb://chat_user:chat_pass@localhost:27017/eccommerce?authSource=admin";

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB (eccommerce)');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;


