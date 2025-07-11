const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
        index: true
    },
    sender_id: {
        type: Number,
        required: true
    },
    sender_name: {
        type: String,
        required: true
    },
    recipient_id: {
        type: Number,
        required: false // For group chats, this might be null
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    message_type: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    file_url: {
        type: String,
        required: false
    },
    is_read: {
        type: Boolean,
        default: false
    },
    is_edited: {
        type: Boolean,
        default: false
    },
    edited_at: {
        type: Date,
        required: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Add indexes for better performance
messageSchema.index({ room_id: 1, createdAt: -1 });
messageSchema.index({ sender_id: 1 });
messageSchema.index({ recipient_id: 1 });

module.exports = mongoose.model('Message', messageSchema);
