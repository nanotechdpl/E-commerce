const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    room_name: {
        type: String,
        required: false
    },
    room_type: {
        type: String,
        enum: ['private', 'group'],
        default: 'private'
    },
    topic: {
        topic_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
            required: false
        },
        topic_name: {
            type: String,
            required: false
        }
    },
    participants: [{
        user_id: {
            type: Number,
            required: true
        },
        user_name: {
            type: String,
            required: true
        },
        joined_at: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    last_message: {
        message: String,
        sender_name: String,
        timestamp: Date
    },
    is_active: {
        type: Boolean,
        default: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

roomSchema.index({ 'participants.user_id': 1 });

module.exports = mongoose.model('Room', roomSchema);
