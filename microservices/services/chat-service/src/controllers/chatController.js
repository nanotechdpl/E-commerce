const Message = require('../models/Message.js');
const Room = require('../models/Room');
const BlockList = require('../models/BlockList');
const ToggleList = require('../models/ToggleList');
const Assignment = require('../models/Assignment');
const UserProfile = require('../models/UserProfile');
const MessageForward = require('../models/MessageForward');
const moment = require('moment');

class ChatController {
    // Send a new message
    async sendMessage(req, res) {
        try {
            const { room_id, sender_id, sender_name, recipient_id, message, message_type, file_url, sender_role } = req.body;

            // Check if room exists
            const room = await Room.findOne({ room_id });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Check if user is blocked
            const isBlocked = await BlockList.findOne({ 
                user_id: sender_id, 
                room_id, 
                is_active: true, 
                block_type: { $in: ['message', 'all'] } 
            });
            
            if (isBlocked) {
                return res.status(403).json({ error: 'You are blocked from sending messages' });
            }

            // Check if messaging is disabled for user
            const isToggled = await ToggleList.findOne({ 
                user_id: sender_id, 
                room_id, 
                toggle_type: 'message', 
                is_enabled: false 
            });
            
            if (isToggled) {
                return res.status(403).json({ error: 'Messaging is disabled for you' });
            }

            // Create new message with sender_role
            const newMessage = new Message({
                room_id,
                sender_id,
                sender_name,
                sender_role: sender_role || 'user', // Ensure sender_role is saved
                recipient_id,
                message,
                message_type: message_type || 'text',
                file_url
            });

            await newMessage.save();

            // Update room's last message
            await Room.updateOne(
                { room_id },
                {
                    last_message: {
                        message,
                        sender_name,
                        timestamp: new Date()
                    }
                }
            );

            // Assignment Logic: If sender is admin/sub-admin and this is their first reply, assign the chat
            if (sender_role === 'admin' || sender_role === 'sub-admin') {
                let assignment = await Assignment.findOne({ room_id, status: 'active' });
                if (!assignment) {
                    assignment = new Assignment({
                        room_id,
                        assigned_to: sender_id,
                        type: room.room_type === 'group' ? 'agency' : 'user',
                        status: 'active',
                        last_active: new Date()
                    });
                    await assignment.save();
                    
                    // Update user profile with assigned admin if it's a user chat
                    if (room.room_type === 'private') {
                        const userParticipant = room.participants.find(p => p.role === 'member');
                        if (userParticipant) {
                            await UserProfile.findOneAndUpdate(
                                { user_id: userParticipant.user_id },
                                {
                                    assigned_admin: {
                                        admin_id: parseInt(sender_id),
                                        admin_name: sender_name,
                                        assigned_at: new Date()
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                } else if (assignment.assigned_to === sender_id) {
                    // Update last_active timestamp
                    assignment.last_active = new Date();
                    await assignment.save();
                }
            }

            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: newMessage
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Send admin message (specialized for admin panel)
    async sendAdminMessage(req, res) {
        try {
            const { room_id, sender_id, sender_name, recipient_id, message, message_type, file_url, sender_role } = req.body;

            // Validate admin role
            if (sender_role !== 'admin' && sender_role !== 'sub-admin') {
                return res.status(403).json({ error: 'Only admins can use this endpoint' });
            }

            // Check if room exists
            const room = await Room.findOne({ room_id });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Create new message with admin role
            const newMessage = new Message({
                room_id,
                sender_id,
                sender_name,
                sender_role: sender_role,
                recipient_id,
                message,
                message_type: message_type || 'text',
                file_url
            });

            await newMessage.save();

            // Update room's last message
            await Room.updateOne(
                { room_id },
                {
                    last_message: {
                        message,
                        sender_name,
                        timestamp: new Date()
                    }
                }
            );

            // Assignment Logic: If this is admin's first reply, assign the chat
            let assignment = await Assignment.findOne({ room_id, status: 'active' });
            if (!assignment) {
                assignment = new Assignment({
                    room_id,
                    assigned_to: sender_id,
                    type: room.room_type === 'group' ? 'agency' : 'user',
                    status: 'active',
                    last_active: new Date()
                });
                await assignment.save();
                
                // Update user profile with assigned admin if it's a user chat
                if (room.room_type === 'private') {
                    const userParticipant = room.participants.find(p => p.role === 'member');
                    if (userParticipant) {
                        await UserProfile.findOneAndUpdate(
                            { user_id: userParticipant.user_id },
                            {
                                assigned_admin: {
                                    admin_id: parseInt(sender_id),
                                    admin_name: sender_name,
                                    assigned_at: new Date()
                                }
                            },
                            { upsert: true }
                        );
                    }
                }
            } else if (assignment.assigned_to === sender_id) {
                // Update last_active timestamp
                assignment.last_active = new Date();
                await assignment.save();
            }

            res.status(201).json({
                success: true,
                message: 'Admin message sent successfully',
                data: newMessage,
                assignment: assignment
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get messages for a room
    async getMessages(req, res) {
        try {
            const { roomId } = req.params;
            const { page = 1, limit = 50 } = req.query;

            const skip = (page - 1) * limit;

            const messages = await Message.find({ room_id: roomId })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip);

            const total = await Message.countDocuments({ room_id: roomId });

            res.json({
                success: true,
                data: {
                    messages: messages.reverse(), // Reverse to show oldest first
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Edit a message
    async editMessage(req, res) {
        try {
            const { messageId } = req.params;
            const { message, sender_id } = req.body;

            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }

            // Check if sender is the owner
            if (existingMessage.sender_id !== sender_id) {
                return res.status(403).json({ error: 'Unauthorized to edit this message' });
            }

            const updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                {
                    message,
                    is_edited: true,
                    edited_at: new Date()
                },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Message updated successfully',
                data: updatedMessage
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete a message
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const { sender_id } = req.body;

            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            // Check if sender is the owner
            if (message.sender_id !== sender_id) {
                return res.status(403).json({ error: 'Unauthorized to delete this message' });
            }

            await Message.findByIdAndDelete(messageId);

            res.json({
                success: true,
                message: 'Message deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Mark message as read
    async markAsRead(req, res) {
        try {
            const { messageId } = req.params;
            const { user_id } = req.body;

            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            // Only recipient can mark as read
            if (message.recipient_id !== user_id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await Message.findByIdAndUpdate(messageId, { is_read: true });

            res.json({
                success: true,
                message: 'Message marked as read'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create a new room
    async createRoom(req, res) {
        try {
            const { room_id, room_name, room_type, participants } = req.body;

            // Check if room already exists
            const existingRoom = await Room.findOne({ room_id });
            if (existingRoom) {
                return res.status(400).json({ error: 'Room already exists' });
            }

            const newRoom = new Room({
                room_id,
                room_name,
                room_type: room_type || 'private',
                participants: participants.map(p => ({
                    ...p,
                    joined_at: new Date()
                }))
            });

            await newRoom.save();

            res.status(201).json({
                success: true,
                message: 'Room created successfully',
                data: newRoom
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user's rooms
    async getUserRooms(req, res) {
        try {
            const { userId } = req.params;

            const rooms = await Room.find({
                'participants.user_id': parseInt(userId),
                is_active: true
            }).sort({ updatedAt: -1 });

            res.json({
                success: true,
                data: rooms
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get room details
    async getRoomDetails(req, res) {
        try {
            const { roomId } = req.params;

            const room = await Room.findOne({ room_id: roomId });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.json({
                success: true,
                data: room
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Join a room
    async joinRoom(req, res) {
        try {
            const { roomId } = req.params;
            const { user_id, user_name } = req.body;

            const room = await Room.findOne({ room_id: roomId });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Check if user is already in room
            const isParticipant = room.participants.some(p => p.user_id === user_id);
            if (isParticipant) {
                return res.status(200).json({ success: true, message: 'User already in room', data: room });
            }

            // Add user to room
            room.participants.push({
                user_id,
                user_name,
                joined_at: new Date()
            });

            await room.save();

            res.json({
                success: true,
                message: 'Joined room successfully',
                data: room
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Leave a room
    async leaveRoom(req, res) {
        try {
            const { roomId } = req.params;
            const { user_id } = req.body;

            const room = await Room.findOne({ room_id: roomId });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Remove user from participants
            room.participants = room.participants.filter(p => p.user_id !== user_id);
            await room.save();

            res.json({
                success: true,
                message: 'Left room successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update room
    async updateRoom(req, res) {
        try {
            const { roomId } = req.params;
            const { room_name, metadata } = req.body;

            const updatedRoom = await Room.findOneAndUpdate(
                { room_id: roomId },
                { room_name, metadata },
                { new: true }
            );

            if (!updatedRoom) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.json({
                success: true,
                message: 'Room updated successfully',
                data: updatedRoom
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get room participants
    async getRoomParticipants(req, res) {
        try {
            const { roomId } = req.params;

            const room = await Room.findOne({ room_id: roomId });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.json({
                success: true,
                data: room.participants
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get unread messages for user
    async getUnreadMessages(req, res) {
        try {
            const { userId } = req.params;

            const unreadMessages = await Message.find({
                recipient_id: parseInt(userId),
                is_read: false
            }).populate('room_id');

            res.json({
                success: true,
                data: unreadMessages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Block user
    async blockUser(req, res) {
        try {
            const { room_id, user_id, blocked_by, block_type, reason, expires_at } = req.body;

            const blockEntry = new BlockList({
                room_id,
                user_id,
                blocked_by,
                block_type: block_type || 'all',
                reason,
                expires_at: expires_at ? new Date(expires_at) : null,
                is_active: true
            });

            await blockEntry.save();

            res.status(201).json({
                success: true,
                message: 'User blocked successfully',
                data: blockEntry
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Unblock user
    async unblockUser(req, res) {
        try {
            const { room_id, user_id } = req.body;

            await BlockList.updateMany(
                { room_id, user_id, is_active: true },
                { is_active: false }
            );

            res.json({
                success: true,
                message: 'User unblocked successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Toggle user permissions
    async toggleUserPermission(req, res) {
        try {
            const { room_id, user_id, toggled_by, toggle_type, is_enabled, reason, expires_at } = req.body;

            const toggleEntry = new ToggleList({
                room_id,
                user_id,
                toggled_by,
                toggle_type,
                is_enabled,
                reason,
                expires_at: expires_at ? new Date(expires_at) : null,
                is_active: true
            });

            await toggleEntry.save();

            res.status(201).json({
                success: true,
                message: `User ${toggle_type} permission ${is_enabled ? 'enabled' : 'disabled'} successfully`,
                data: toggleEntry
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Forward message to another admin
    async forwardMessage(req, res) {
        try {
            const { message_id, forwarded_to_admin_id, forwarded_by_admin_id, note } = req.body;

            const originalMessage = await Message.findById(message_id);
            if (!originalMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }

            const forwardEntry = new MessageForward({
                original_message_id: message_id,
                original_room_id: originalMessage.room_id,
                forwarded_to_admin_id,
                forwarded_by_admin_id,
                note
            });

            await forwardEntry.save();

            res.status(201).json({
                success: true,
                message: 'Message forwarded successfully',
                data: forwardEntry
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get forwarded messages for admin
    async getForwardedMessages(req, res) {
        try {
            const { admin_id } = req.params;
            const { status } = req.query;

            const filter = { forwarded_to_admin_id: parseInt(admin_id) };
            if (status) filter.status = status;

            const forwardedMessages = await MessageForward.find(filter)
                .populate('original_message_id')
                .sort({ forwarded_at: -1 });

            res.json({
                success: true,
                data: forwardedMessages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get blocked users
    async getBlockedUsers(req, res) {
        try {
            const { room_id } = req.params;

            const blockedUsers = await BlockList.find({ 
                room_id, 
                is_active: true 
            });

            res.json({
                success: true,
                data: blockedUsers
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user permissions
    async getUserPermissions(req, res) {
        try {
            const { room_id, user_id } = req.params;

            const [blocked, toggled] = await Promise.all([
                BlockList.findOne({ room_id, user_id, is_active: true }),
                ToggleList.find({ room_id, user_id, is_active: true })
            ]);

            res.json({
                success: true,
                data: {
                    is_blocked: !!blocked,
                    block_details: blocked,
                    permissions: toggled
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get admin assignments
    async getAdminAssignments(req, res) {
        try {
            const { admin_id } = req.params;
            
            const assignments = await Assignment.find({ 
                assigned_to: parseInt(admin_id), 
                status: 'active' 
            });

            res.json({
                success: true,
                data: assignments
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get room assignment status
    async getRoomAssignment(req, res) {
        try {
            const { room_id } = req.params;
            
            const assignment = await Assignment.findOne({ 
                room_id, 
                status: 'active' 
            });

            res.json({
                success: true,
                data: assignment
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Debug: Get room messages
    async getRoomMessagesDebug(req, res) {
        try {
            const { room_id } = req.params;
            
            const messages = await Message.find({ room_id }).sort({ createdAt: 1 });

            res.json({
                success: true,
                data: messages.map(m => ({
                    _id: m._id,
                    sender_id: m.sender_id,
                    sender_name: m.sender_name,
                    sender_role: m.sender_role,
                    message: m.message,
                    createdAt: m.createdAt
                }))
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Debug: Force admin reply (temporary for testing)
    async forceAdminReply(req, res) {
        try {
            const { room_id } = req.params;
            const { message = 'Test admin reply' } = req.body;
            
            const newMessage = new Message({
                room_id,
                sender_id: 2, // Admin ID
                sender_name: 'Admin',
                sender_role: 'admin',
                message,
                message_type: 'text'
            });

            await newMessage.save();

            res.json({
                success: true,
                message: 'Admin reply created',
                data: newMessage
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ChatController();