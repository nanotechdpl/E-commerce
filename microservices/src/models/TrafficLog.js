const mongoose = require('mongoose');

const TrafficLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
  location: {
    country: String,
    city: String,
    lat: Number,
    lon: Number,
  },
  ip: { type: String },
  isNewVisitor: { type: Boolean, default: false },
  visitedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrafficLog', TrafficLogSchema); 