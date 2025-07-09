const UserProfile = require('../models/UserProfile');
const Message = require('../models/Message');
const Room = require('../models/Room');

class UserProfileController {
    // Get user profile
    async getUserProfile(req, res) {
        try {
            const { user_id } = req.params;

            const profile = await UserProfile.findOne({ user_id: parseInt(user_id) });
            if (!profile) {
                return res.status(404).json({ error: 'User profile not found' });
            }

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create or update user profile
    async createOrUpdateProfile(req, res) {
        try {
            const { user_id, user_name, user_type, is_authorized, profile_photo, agency_logo, email, phone } = req.body;

            const profile = await UserProfile.findOneAndUpdate(
                { user_id: parseInt(user_id) },
                {
                    user_name,
                    user_type,
                    is_authorized,
                    profile_photo,
                    agency_logo,
                    email,
                    phone,
                    last_seen: new Date()
                },
                { upsert: true, new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: profile
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user online status
    async updateOnlineStatus(req, res) {
        try {
            const { user_id, is_online } = req.body;

            const profile = await UserProfile.findOneAndUpdate(
                { user_id: parseInt(user_id) },
                {
                    is_online,
                    last_seen: new Date()
                },
                { new: true }
            );

            if (!profile) {
                return res.status(404).json({ error: 'User profile not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Online status updated',
                data: profile
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all users (for admin panel)
    async getAllUsers(req, res) {
        try {
            const { user_type, is_authorized, is_online } = req.query;
            const filter = {};

            if (user_type) filter.user_type = user_type;
            if (is_authorized !== undefined) filter.is_authorized = is_authorized === 'true';
            if (is_online !== undefined) filter.is_online = is_online === 'true';

            const users = await UserProfile.find(filter)
                .select('user_id user_name user_type is_authorized profile_photo agency_logo is_online last_seen assigned_admin')
                .sort({ last_seen: -1 });

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get unauthorized users (for admin panel)
    async getUnauthorizedUsers(req, res) {
        try {
            const users = await UserProfile.find({ is_authorized: false })
                .select('user_id user_name user_type last_seen')
                .sort({ last_seen: -1 });

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Authorize user
    async authorizeUser(req, res) {
        try {
            const { user_id } = req.params;

            const profile = await UserProfile.findOneAndUpdate(
                { user_id: parseInt(user_id) },
                { is_authorized: true },
                { new: true }
            );

            if (!profile) {
                return res.status(404).json({ error: 'User profile not found' });
            }

            res.status(200).json({
                success: true,
                message: 'User authorized successfully',
                data: profile
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Assign user to admin
    async assignUserToAdmin(req, res) {
        try {
            const { user_id, admin_id, admin_name } = req.body;

            const profile = await UserProfile.findOneAndUpdate(
                { user_id: parseInt(user_id) },
                {
                    assigned_admin: {
                        admin_id: parseInt(admin_id),
                        admin_name,
                        assigned_at: new Date()
                    }
                },
                { new: true }
            );

            if (!profile) {
                return res.status(404).json({ error: 'User profile not found' });
            }

            res.status(200).json({
                success: true,
                message: 'User assigned to admin successfully',
                data: profile
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get users assigned to specific admin
    async getUsersByAdmin(req, res) {
        try {
            const { admin_id } = req.params;

            const users = await UserProfile.find({
                'assigned_admin.admin_id': parseInt(admin_id)
            })
                .select('user_id user_name user_type is_authorized profile_photo agency_logo is_online last_seen')
                .sort({ last_seen: -1 });

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user chat history
    async getUserChatHistory(req, res) {
        try {
            const { user_id } = req.params;
            const { limit = 50, offset = 0 } = req.query;

            // Find rooms where user is participant
            const userRooms = await Room.find({
                'participants.user_id': parseInt(user_id)
            }).select('room_id room_name topic');

            const roomIds = userRooms.map(room => room.room_id);

            // Get messages from user's rooms
            const messages = await Message.find({
                room_id: { $in: roomIds }
            })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(offset));

            res.status(200).json({
                success: true,
                data: {
                    rooms: userRooms,
                    messages
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserProfileController(); 