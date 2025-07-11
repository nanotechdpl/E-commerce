const mongoose = require('mongoose');

const predefinedMessageSchema = new mongoose.Schema({
  admin_id: {
    type: Number,
    required: true,
    index: true
  },
  admin_name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['greeting', 'support', 'billing', 'technical', 'general'],
    default: 'general'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  usage_count: {
    type: Number,
    default: 0
  },
  last_used: {
    type: Date,
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

predefinedMessageSchema.index({ admin_id: 1, is_active: 1 });
predefinedMessageSchema.index({ category: 1 });
predefinedMessageSchema.index({ usage_count: -1 });

module.exports = mongoose.model('PredefinedMessage', predefinedMessageSchema); 