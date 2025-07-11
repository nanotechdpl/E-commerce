
const mongoose = require('mongoose');

const LivechatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Registered user or null
  visitorId: { type: String, default: null }, // Visitor's IP or null
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admins
  message: { type: String, required: true },
  file: { type: String },
  isSeen: { type: Boolean, default: false },
  deletedByUser: { type: Boolean, default: false },
  deletedByAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Ensure at least one (sender or visitorId) is set before saving
LivechatSchema.pre('save', function (next) {
  if (!this.sender && !this.visitorId) {
    return next(new Error('Either sender (user) or visitorId (visitor IP) is required.'));
  }
  next();
});

module.exports = mongoose.model('LiveChat', LivechatSchema);

// Ensure either sender or visitorId is provided
LivechatSchema.pre('save', function (next) {
  if (!this.sender && !this.visitorId) {
    return next(new Error('Either sender (user) or visitorId is required.'));
  }
  next();
});


const LivechatModel = mongoose.model('livechat',LivechatSchema)
 
module.exports =  LivechatModel