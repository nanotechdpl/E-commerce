const mongoose = require('mongoose');

const toggleListSchema = new mongoose.Schema({
  room_id: { type: String, required: false, index: true },
  user_id: { type: Number, required: true },
  toggled_by: { type: Number, required: true },
  toggle_type: { type: String, enum: ['message', 'call', 'voice'], required: true },
  is_enabled: { type: Boolean, default: true },
  reason: { type: String, required: false },
  expires_at: { type: Date, required: false },
  is_active: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

toggleListSchema.index({ room_id: 1, user_id: 1, toggle_type: 1, is_active: 1 });
toggleListSchema.index({ user_id: 1, toggle_type: 1 });

module.exports = mongoose.model('ToggleList', toggleListSchema); 