const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  room_id: { type: String, required: true, index: true },
  assigned_to: { type: Number, required: true }, // admin/sub-admin user id
  assigned_at: { type: Date, default: Date.now },
  type: { type: String, enum: ['user', 'agency', 'order'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  last_active: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

assignmentSchema.index({ room_id: 1, assigned_to: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema); 