const Message = require('../models/Message.js');
const Room = require('../models/Room');
const moment = require('moment');

class ChatController {
    // Send a new message
    async sendMessage(req, res) {
        try {
            const { room_id, sender_id, sender_name, recipient_id, message, message_type, file_url } = req.body;

            // Check if room exists
            const room = await Room.findOne({ room_id });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Create new message
            const newMessage = new Message({
                room_id,
                sender_id,
                sender_name,
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

            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: newMessage
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
                return res.status(400).json({ error: 'User already in room' });
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
}

module.exports = new ChatController();