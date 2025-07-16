const mongoose = require('mongoose');

const AdminNotificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'order', 'agency', 'message', 'payment', 'return'
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId, required: false }, // e.g., orderId, paymentId, etc.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // who triggered the notification
  isRead: { type: Boolean, default: false },
  meta: { type: Object }, // any extra data
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminNotification', AdminNotificationSchema); 