const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        enum: ['user', 'agency', 'admin', 'sub-admin'],
        required: true
    },
    is_authorized: {
        type: Boolean,
        default: false
    },
    profile_photo: {
        type: String,
        required: false
    },
    agency_logo: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    last_seen: {
        type: Date,
        default: Date.now
    },
    is_online: {
        type: Boolean,
        default: false
    },
    last_message_at: {
        type: Date,
        required: false
    },
    assigned_admin: {
        admin_id: {
            type: Number,
            required: false
        },
        admin_name: {
            type: String,
            required: false
        },
        assigned_at: {
            type: Date,
            required: false
        }
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

userProfileSchema.index({ user_id: 1 });
userProfileSchema.index({ user_type: 1 });
userProfileSchema.index({ is_authorized: 1 });
userProfileSchema.index({ is_online: 1 });
userProfileSchema.index({ last_seen: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema); 