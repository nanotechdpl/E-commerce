const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['general', 'technical', 'billing', 'support', 'sales'],
        default: 'general'
    },
    assigned_admins: [{
        admin_id: {
            type: Number,
            required: true
        },
        admin_name: {
            type: String,
            required: true
        },
        assigned_at: {
            type: Date,
            default: Date.now
        }
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

topicSchema.index({ name: 1 });
topicSchema.index({ category: 1 });
topicSchema.index({ is_active: 1 });

module.exports = mongoose.model('Topic', topicSchema); 