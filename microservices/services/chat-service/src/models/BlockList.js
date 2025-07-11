const mongoose = require('mongoose');

const blockListSchema = new mongoose.Schema({
  room_id: { type: String, required: false, index: true }, // null for global block
  user_id: { type: Number, required: true },
  blocked_by: { type: Number, required: true }, // admin/sub-admin id
  reason: { type: String },
  block_type: { type: String, enum: ['message', 'call', 'all'], default: 'all' },
  expires_at: { type: Date },
  is_active: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

blockListSchema.index({ room_id: 1, user_id: 1, is_active: 1 });

module.exports = mongoose.model('BlockList', blockListSchema); 