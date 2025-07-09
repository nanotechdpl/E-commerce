const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/eccommerce";
//let LOCAL_DB_URL = "mongodb://localhost:27017/factoryapp"

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


