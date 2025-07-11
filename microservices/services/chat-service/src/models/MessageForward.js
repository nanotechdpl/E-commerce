const mongoose = require('mongoose');

const messageForwardSchema = new mongoose.Schema({
  original_message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  original_room_id: {
    type: String,
    required: true
  },
  forwarded_to_admin_id: {
    type: Number,
    required: true
  },
  forwarded_by_admin_id: {
    type: Number,
    required: true
  },
  forwarded_at: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'resolved'],
    default: 'pending'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

messageForwardSchema.index({ original_message_id: 1 });
messageForwardSchema.index({ forwarded_to_admin_id: 1 });
messageForwardSchema.index({ status: 1 });

module.exports = mongoose.model('MessageForward', messageForwardSchema); 