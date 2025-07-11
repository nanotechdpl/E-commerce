// models/Subscribe.js
const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscribe', subscribeSchema);