const Message = require('../models/Message');
const Room = require('../models/Room');

const socketHandler = (io) => {
    // Store active connections
    const activeUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // User joins with their ID
        socket.on('user-online', (userData) => {
            const { user_id, user_name } = userData;
            activeUsers.set(socket.id, { user_id, user_name, socket_id: socket.id });

            // Notify others about user status
            socket.broadcast.emit('user-status', {
                user_id,
                user_name,
                status: 'online'
            });

            console.log(`User ${user_name} (${user_id}) is online`);
        });

        // Join a chat room
        socket.on('join-room', async (data) => {
            try {
                const { room_id, user_id } = data;

                // Verify room exists and user is participant
                const room = await Room.findOne({
                    room_id,
                    'participants.user_id': user_id
                });

                if (room) {
                    socket.join(room_id);
                    socket.emit('room-joined', { room_id, status: 'success' });

                    // Notify others in room
                    socket.to(room_id).emit('user-joined-room', {
                        user_id,
                        room_id,
                        timestamp: new Date()
                    });

                    console.log(`User ${user_id} joined room ${room_id}`);
                } else {
                    socket.emit('room-joined', { room_id, status: 'error', message: 'Room not found or access denied' });
                }
            } catch (error) {
                socket.emit('room-joined', { room_id: data.room_id, status: 'error', message: error.message });
            }
        });

        // Leave a chat room
        socket.on('leave-room', (data) => {
            const { room_id, user_id } = data;
            socket.leave(room_id);

            // Notify others in room
            socket.to(room_id).emit('user-left-room', {
                user_id,
                room_id,
                timestamp: new Date()
            });

            console.log(`User ${user_id} left room ${room_id}`);
        });

        // Handle new message
        socket.on('send-message', async (messageData) => {
            try {
                const { room_id, sender_id, sender_name, recipient_id, message, message_type, file_url } = messageData;

                // Verify room exists and user is participant
                const room = await Room.findOne({
                    room_id,
                    'participants.user_id': sender_id
                });

                if (!room) {
                    socket.emit('message-error', { error: 'Room not found or access denied' });
                    return;
                }

                // Create and save message
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

                // Emit message to all users in the room
                io.to(room_id).emit('new-message', {
                    _id: newMessage._id,
                    room_id,
                    sender_id,
                    sender_name,
                    recipient_id,
                    message,
                    message_type,
                    file_url,
                    is_read: false,
                    is_edited: false,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.updatedAt
                });

                console.log(`Message sent in room ${room_id} by user ${sender_id}`);
            } catch (error) {
                socket.emit('message-error', { error: error.message });
                console.error('Message error:', error);
            }
        });

        // Handle message editing
        socket.on('edit-message', async (data) => {
            try {
                const { message_id, new_message, sender_id } = data;

                const message = await Message.findById(message_id);
                if (!message) {
                    socket.emit('edit-error', { error: 'Message not found' });
                    return;
                }

                if (message.sender_id !== sender_id) {
                    socket.emit('edit-error', { error: 'Unauthorized' });
                    return;
                }

                const updatedMessage = await Message.findByIdAndUpdate(
                    message_id,
                    {
                        message: new_message,
                        is_edited: true,
                        edited_at: new Date()
                    },
                    { new: true }
                );

                // Emit to all users in the room
                io.to(message.room_id).emit('message-edited', {
                    message_id,
                    new_message,
                    is_edited: true,
                    edited_at: updatedMessage.edited_at
                });

                console.log(`Message ${message_id} edited by user ${sender_id}`);
            } catch (error) {
                socket.emit('edit-error', { error: error.message });
            }
        });

        // Handle message deletion
        socket.on('delete-message', async (data) => {
            try {
                const { message_id, sender_id } = data;

                const message = await Message.findById(message_id);
                if (!message) {
                    socket.emit('delete-error', { error: 'Message not found' });
                    return;
                }

                if (message.sender_id !== sender_id) {
                    socket.emit('delete-error', { error: 'Unauthorized' });
                    return;
                }

                await Message.findByIdAndDelete(message_id);

                // Emit to all users in the room
                io.to(message.room_id).emit('message-deleted', {
                    message_id,
                    room_id: message.room_id
                });

                console.log(`Message ${message_id} deleted by user ${sender_id}`);
            } catch (error) {
                socket.emit('delete-error', { error: error.message });
            }
        });

        // Handle typing indicators
        socket.on('typing-start', (data) => {
            const { room_id, user_id, user_name } = data;
            socket.to(room_id).emit('user-typing', { user_id, user_name, room_id });
        });

        socket.on('typing-stop', (data) => {
            const { room_id, user_id } = data;
            socket.to(room_id).emit('user-stopped-typing', { user_id, room_id });
        });

        // Handle message read receipts
        socket.on('mark-read', async (data) => {
            try {
                const { message_id, user_id } = data;

                const message = await Message.findById(message_id);
                if (message && message.recipient_id === user_id) {
                    await Message.findByIdAndUpdate(message_id, { is_read: true });

                    // Notify sender
                    io.to(message.room_id).emit('message-read', {
                        message_id,
                        reader_id: user_id,
                        room_id: message.room_id
                    });
                }
            } catch (error) {
                console.error('Mark read error:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            const userData = activeUsers.get(socket.id);
            if (userData) {
                // Notify others about user going offline
                socket.broadcast.emit('user-status', {
                    user_id: userData.user_id,
                    user_name: userData.user_name,
                    status: 'offline'
                });

                activeUsers.delete(socket.id);
                console.log(`User ${userData.user_name} (${userData.user_id}) disconnected`);
            } else {
                console.log('User disconnected:', socket.id);
            }
        });
    });

    // Utility function to get online users
    const getOnlineUsers = () => {
        return Array.from(activeUsers.values()).map(user => ({
            user_id: user.user_id,
            user_name: user.user_name,
            status: 'online'
        }));
    };

    // Expose utility functions
    io.getOnlineUsers = getOnlineUsers;
};

module.exports = socketHandler;
