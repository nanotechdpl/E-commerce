const Message = require('../models/Message');
const Room = require('../models/Room');
const Assignment = require('../models/Assignment');
const BlockList = require('../models/BlockList');
const ToggleList = require('../models/ToggleList');
const PredefinedMessage = require('../models/PredefinedMessage');
const UserProfile = require('../models/UserProfile');
const Topic = require('../models/Topic');
const MessageForward = require('../models/MessageForward');
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const { hasAdminReplied } = require('../utils');

// Create Redis client with error handling
let redisClient;
try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
    });
    
    redisClient.on('error', (err) => {
        console.log('Redis connection error (non-critical):', err.message);
    });
    
    redisClient.on('connect', () => {
        console.log('Redis connected successfully');
    });
} catch (error) {
    console.log('Redis not available, using in-memory fallback');
    redisClient = null;
}

// Helper functions
async function setUserOnline(user_id, role) {
    if (redisClient) {
        try {
            await redisClient.hset(`presence:${role}:${user_id}`, 'status', 'online', 'last_seen', Date.now());
        } catch (error) {
            console.log('Redis setUserOnline error:', error.message);
        }
    }
}
async function setUserOffline(user_id, role) {
    if (redisClient) {
        try {
            await redisClient.hset(`presence:${role}:${user_id}`, 'status', 'offline', 'last_seen', Date.now());
        } catch (error) {
            console.log('Redis setUserOffline error:', error.message);
        }
    }
}
async function getUserPresence(user_id, role) {
    if (redisClient) {
        try {
            return await redisClient.hgetall(`presence:${role}:${user_id}`);
        } catch (error) {
            console.log('Redis getUserPresence error:', error.message);
            return null;
        }
    }
    return null;
}

const socketHandler = (io) => {
    // Store active connections
    const activeUsers = new Map();

    // Minimal WebRTC signaling with call rules
    const rooms = {};

    io.on('connection', (socket) => {
        console.log(`[SOCKET] New connection: ${socket.id}`);
        // Log all events
        const originalOn = socket.on.bind(socket);
        socket.on = (event, ...args) => {
            console.log(`[SOCKET] Event received: ${event}`, args[0]);
            return originalOn(event, ...args);
        };

        // User joins with their ID
        socket.on('user-online', (userData) => {
            const { user_id, user_name, role } = userData;
            activeUsers.set(socket.id, { user_id, user_name, socket_id: socket.id, role });

            // Notify others about user status
            socket.broadcast.emit('user-status', {
                user_id,
                user_name,
                status: 'online'
            });

            console.log(`User ${user_name} (${user_id}) is online`);
            setUserOnline(user_id, role);
        });

        // Join a signaling room
        socket.on('join-room', async ({ room, user_id, role }) => {
            console.log(`[SIGNAL] join-room: user_id=${user_id}, role=${role}, room=${room}`);
            if (!rooms[room]) rooms[room] = [];
            rooms[room].push(socket.id);
            socket.join(room);
            socket.room = room;
            socket.user_id = user_id;
            socket.role = role;
            // Notify both clients if room is ready
            if (rooms[room].length === 2) {
                io.to(room).emit('ready');
                console.log(`[SIGNAL] room ready: ${room}`);
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
                const { room_id, sender_id, sender_name, recipient_id, message, message_type, file_url, sender_role } = messageData;

                // Verify room exists
                const room = await Room.findOne({ room_id });
                if (!room) {
                    socket.emit('message-error', { error: 'Room not found' });
                    return;
                }

                // Check if user is participant (for users/agencies) or admin (for admins/sub-admins)
                const isParticipant = room.participants.some(p => p.user_id === sender_id);
                const isAdmin = sender_role === 'admin' || sender_role === 'sub-admin';
                
                if (!isParticipant && !isAdmin) {
                    socket.emit('message-error', { error: 'Access denied - not a participant or admin' });
                    return;
                }

                // --- Permission Checks ---
                const isBlocked = await BlockList.findOne({ user_id: sender_id, room_id, is_active: true, block_type: { $in: ['message', 'all'] } });
                const isToggled = await ToggleList.findOne({ user_id: sender_id, room_id, toggle_type: 'message', is_enabled: false });
                if (isBlocked || isToggled) {
                    socket.emit('message-error', { error: 'Messaging is disabled or you are blocked.' });
                    return;
                }

                // Create and save message with sender_role
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
                console.log('Saving message to DB:', newMessage);
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

                // --- Assignment Logic ---
                // If sender is admin/sub-admin and this is their first reply, assign the chat
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
                        
                        // Notify all admins/sub-admins about the assignment
                        io.emit('assignment-updated', { room_id, assigned_to: sender_id });
                        io.emit('user_assigned_to_admin', {
                            room_id,
                            user_id: room.participants.find(p => p.role === 'member')?.user_id,
                            admin_id: sender_id,
                            admin_name: sender_name,
                            timestamp: new Date()
                        });
                    } else if (assignment.assigned_to === sender_id) {
                        // Update last_active timestamp
                        assignment.last_active = new Date();
                        await assignment.save();
                    }
                }

                // --- Routing Logic ---
                // If assigned, only assigned admin/sub-admin and user/agency get the message
                const assignment = await Assignment.findOne({ room_id, status: 'active' });
                if (assignment) {
                    // Emit to assigned admin/sub-admin and all participants
                    const msgObj = {
                        _id: newMessage._id,
                        room_id,
                        sender_id,
                        sender_name,
                        sender_role: newMessage.sender_role,
                        recipient_id,
                        message,
                        message_type,
                        file_url,
                        is_read: false,
                        is_edited: false,
                        createdAt: newMessage.createdAt,
                        updatedAt: newMessage.updatedAt,
                        assigned_to: assignment.assigned_to
                    };
                    io.to(room_id).emit('new-message', msgObj);
                    console.log('Broadcasting new-message (assigned):', msgObj);
                } else {
                    // Emit to all permitted admins/sub-admins and participants
                    const msgObj = {
                        _id: newMessage._id,
                        room_id,
                        sender_id,
                        sender_name,
                        sender_role: newMessage.sender_role,
                        recipient_id,
                        message,
                        message_type,
                        file_url,
                        is_read: false,
                        is_edited: false,
                        createdAt: newMessage.createdAt,
                        updatedAt: newMessage.updatedAt
                    };
                    io.to(room_id).emit('new-message', msgObj);
                    console.log('Broadcasting new-message (unassigned):', msgObj);
                }
                console.log(`Message sent in room ${room_id} by ${sender_role} ${sender_id}`);

                // --- Inactivity Handling Placeholder ---
                // TODO: Use a scheduler or timer to check assignment.last_active and reassign if inactive for X minutes
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

        // Minimal signaling relay with call rules
        socket.on('signal', async (data) => {
            console.log(`[SIGNAL] signal: type=${data.type}, from user_id=${socket.user_id}, room=${socket.room}`);
            // Enforce call rules only for 'offer' type
            if (data.type === 'offer') {
                // Find all messages in the room
                const messages = await Message.find({ room_id: data.room }).sort({ createdAt: 1 });
                const userMsgIdx = messages.findIndex(m => String(m.sender_id) === String(socket.user_id) && (socket.role === 'user' || socket.role === 'agency'));
                if (userMsgIdx === -1) {
                    socket.emit('signal', { type: 'error', reason: 'You must send a message before starting a call.' });
                    console.log(`[SIGNAL] offer denied: user has not sent a message (user_id=${socket.user_id}, room=${socket.room})`);
                    return;
                }
                const adminReply = messages.slice(userMsgIdx + 1).find(m => m.sender_role === 'admin' || m.sender_role === 'sub-admin');
                if (!adminReply) {
                    socket.emit('signal', { type: 'error', reason: 'An admin must reply before you can start a call.' });
                    console.log(`[SIGNAL] offer denied: no admin reply (user_id=${socket.user_id}, room=${socket.room})`);
                    return;
                }
                console.log(`[SIGNAL] offer allowed: user_id=${socket.user_id}, room=${socket.room}`);
            }
            // Relay signaling to other peer in room
            if (rooms[socket.room]) {
                rooms[socket.room].forEach(id => {
                    if (id !== socket.id) {
                        io.to(id).emit('signal', data);
                        console.log(`[SIGNAL] relayed: type=${data.type}, to socket=${id}, room=${socket.room}`);
                    }
                });
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
                setUserOffline(userData.user_id, userData.role);
            } else {
                console.log('User disconnected:', socket.id);
            }

            if (socket.room && rooms[socket.room]) {
                rooms[socket.room] = rooms[socket.room].filter(id => id !== socket.id);
                if (rooms[socket.room].length === 0) delete rooms[socket.room];
            }
        });

        // --- Assignment & Routing Logic ---
        // TODO: On admin/sub-admin reply, assign user/agency/order chat to them
        // TODO: On admin inactivity, reassign or reopen chat to all admins

        // --- Message Lifecycle ---
        // TODO: Track last activity for assignment and message expiration
        // TODO: Schedule message deletion (set TTL or use job scheduler)

        // --- Admin Controls ---
        socket.on('block_user', async (data) => {
            // data: { room_id, user_id, block_type, expires_at, reason, admin_id }
            await BlockList.create({
                room_id: data.room_id,
                user_id: data.user_id,
                blocked_by: data.admin_id,
                block_type: data.block_type,
                expires_at: data.expires_at,
                reason: data.reason
            });
            io.to(data.room_id).emit('user-blocked', { user_id: data.user_id, block_type: data.block_type });
        });
        socket.on('unblock_user', async (data) => {
            // data: { room_id, user_id, block_type }
            await BlockList.updateMany({ room_id: data.room_id, user_id: data.user_id, block_type: data.block_type, is_active: true }, { is_active: false });
            io.to(data.room_id).emit('user-unblocked', { user_id: data.user_id, block_type: data.block_type });
        });
        socket.on('toggle_message', async (data) => {
            // data: { room_id, user_id, is_enabled, admin_id }
            await ToggleList.findOneAndUpdate(
                { room_id: data.room_id, user_id: data.user_id, toggle_type: 'message' },
                { is_enabled: data.is_enabled, toggled_by: data.admin_id },
                { upsert: true }
            );
            io.to(data.room_id).emit('message-toggled', { user_id: data.user_id, is_enabled: data.is_enabled });
        });
        socket.on('toggle_call', async (data) => {
            // data: { room_id, user_id, is_enabled, admin_id }
            await ToggleList.findOneAndUpdate(
                { room_id: data.room_id, user_id: data.user_id, toggle_type: 'call' },
                { is_enabled: data.is_enabled, toggled_by: data.admin_id },
                { upsert: true }
            );
            io.to(data.room_id).emit('call-toggled', { user_id: data.user_id, is_enabled: data.is_enabled });
        });
        socket.on('forward_message', async (data) => {
            // data: { message_id, to_admin_id, from_admin_id }
            // TODO: Implement message forwarding logic (find message, send to new admin)
        });
        socket.on('use_predefined_message', async (data) => {
            try {
                const { room_id, admin_id, message_id } = data;

                // Get predefined message
                const predefinedMessage = await PredefinedMessage.findById(message_id);
                if (!predefinedMessage) {
                    socket.emit('predefined_message_error', { error: 'Predefined message not found' });
                    return;
                }

                // Get room details
                const room = await Room.findOne({ room_id });
                if (!room) {
                    socket.emit('predefined_message_error', { error: 'Room not found' });
                    return;
                }

                // Create message using predefined content
                const newMessage = new Message({
                    room_id,
                    sender_id: parseInt(admin_id),
                    sender_name: 'Admin',
                    sender_role: 'admin',
                    message: predefinedMessage.message,
                    message_type: 'text'
                });

                await newMessage.save();

                // Update predefined message usage count
                await PredefinedMessage.findByIdAndUpdate(message_id, {
                    $inc: { usage_count: 1 },
                    last_used: new Date()
                });

                // Update room's last message
                await Room.updateOne(
                    { room_id },
                    {
                        last_message: {
                            message: predefinedMessage.message,
                            sender_name: 'Admin',
                            timestamp: new Date()
                        }
                    }
                );

                // Handle assignment logic
                let assignment = await Assignment.findOne({ room_id, status: 'active' });
                if (!assignment) {
                    assignment = new Assignment({
                        room_id,
                        assigned_to: parseInt(admin_id),
                        type: room.room_type === 'group' ? 'agency' : 'user',
                        status: 'active',
                        last_active: new Date()
                    });
                    await assignment.save();
                    
                    // Update user profile with assigned admin
                    if (room.room_type === 'private') {
                        const userParticipant = room.participants.find(p => p.role === 'member');
                        if (userParticipant) {
                            await UserProfile.findOneAndUpdate(
                                { user_id: userParticipant.user_id },
                                {
                                    assigned_admin: {
                                        admin_id: parseInt(admin_id),
                                        admin_name: 'Admin',
                                        assigned_at: new Date()
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                    
                    // Notify about assignment
                    io.emit('assignment-updated', { room_id, assigned_to: admin_id });
                    io.emit('user_assigned_to_admin', {
                        room_id,
                        user_id: room.participants.find(p => p.role === 'member')?.user_id,
                        admin_id: parseInt(admin_id),
                        admin_name: 'Admin',
                        timestamp: new Date()
                    });
                }

                // Broadcast message
                const msgObj = {
                    _id: newMessage._id,
                    room_id,
                    sender_id: parseInt(admin_id),
                    sender_name: 'Admin',
                    sender_role: 'admin',
                    message: predefinedMessage.message,
                    message_type: 'text',
                    is_read: false,
                    is_edited: false,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.updatedAt,
                    assigned_to: assignment?.assigned_to
                };

                io.to(room_id).emit('new-message', msgObj);
                socket.emit('predefined_message_sent', { success: true, message: newMessage });

            } catch (error) {
                socket.emit('predefined_message_error', { error: error.message });
            }
        });

        // --- File Upload ---
        socket.on('file_upload', async (data) => {
            try {
                // data: { room_id, sender_id, file, file_name, file_type, sender_role, sender_name }
                const FileUploadController = require('../controllers/fileUploadController');
                
                // If user/agency, check for admin reply
                if (data.sender_role === 'user' || data.sender_role === 'agency') {
                    const adminReplied = await hasAdminReplied(data.room_id, data.sender_id);
                    console.log(`[FILE-UPLOAD] Admin replied check for user ${data.sender_id}: ${adminReplied}`);
                    if (!adminReplied) {
                        socket.emit('file-upload-error', { error: 'An admin must reply before you can upload files.' });
                        return;
                    }
                }

                // Validate file
                const fileData = {
                    mimetype: data.file_type,
                    size: data.file_size || 0,
                    originalname: data.file_name
                };
                
                const fileValidation = FileUploadController.validateFile(fileData);
                if (!fileValidation.valid) {
                    socket.emit('file-upload-error', { error: fileValidation.error });
                    return;
                }

                // Save file using the controller
                const fileBuffer = Buffer.from(data.file, 'base64');
                const fileObj = {
                    buffer: fileBuffer,
                    originalname: data.file_name,
                    mimetype: data.file_type,
                    size: fileBuffer.length
                };

                const saveResult = await FileUploadController.saveFile(fileObj, data.room_id);
                if (!saveResult.success) {
                    socket.emit('file-upload-error', { error: saveResult.error });
                    return;
                }

                // Create message record
                const newMessage = new Message({
                    room_id: data.room_id,
                    sender_id: parseInt(data.sender_id),
                    sender_name: data.sender_name,
                    sender_role: data.sender_role,
                    message: `[File: ${data.file_name}]`,
                    message_type: 'file',
                    file_url: saveResult.fileUrl,
                    file_name: data.file_name,
                    file_size: fileBuffer.length,
                    file_type: data.file_type
                });

                await newMessage.save();

                // Update room's last message
                await Room.updateOne(
                    { room_id: data.room_id },
                    {
                        last_message: {
                            message: `[File: ${data.file_name}]`,
                            sender_name: data.sender_name,
                            timestamp: new Date()
                        }
                    }
                );

                // Emit success event
                io.to(data.room_id).emit('new-message', {
                    _id: newMessage._id,
                    room_id: data.room_id,
                    sender_id: data.sender_id,
                    sender_name: data.sender_name,
                    sender_role: data.sender_role,
                    message: `[File: ${data.file_name}]`,
                    message_type: 'file',
                    file_url: saveResult.fileUrl,
                    file_name: data.file_name,
                    file_size: fileBuffer.length,
                    file_type: data.file_type,
                    createdAt: newMessage.createdAt
                });

                socket.emit('file-upload-success', {
                    message_id: newMessage._id,
                    file_url: saveResult.fileUrl,
                    file_name: data.file_name
                });

            } catch (error) {
                console.error('Socket file upload error:', error);
                socket.emit('file-upload-error', { 
                    error: 'Internal server error during file upload.' 
                });
            }
        });

        // --- Check File Upload Status ---
        socket.on('check_file_upload_status', async (data) => {
            try {
                const { room_id, sender_id, sender_role } = data;
                
                // Check admin reply requirement for users/agencies
                let canUpload = true;
                let errorMessage = null;
                
                if (sender_role === 'user' || sender_role === 'agency') {
                    const adminReplied = await hasAdminReplied(room_id, sender_id);
                    if (!adminReplied) {
                        canUpload = false;
                        errorMessage = 'An admin must reply before you can upload files.';
                    }
                }
                
                socket.emit('file_upload_status', {
                    can_upload: canUpload,
                    permission_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    },
                    assignment_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    },
                    block_toggle_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    }
                });

            } catch (error) {
                console.error('File upload status check error:', error);
                socket.emit('file_upload_status_error', { 
                    error: 'Error checking file upload status.' 
                });
            }
        });

        // --- Check Voice Upload Status ---
        socket.on('check_voice_upload_status', async (data) => {
            console.log('[SOCKET] Handling check_voice_upload_status', data);
            try {
                const { room_id, sender_id, sender_role } = data;
                console.log(`[VOICE-STATUS] Checking voice upload status for ${sender_role} ${sender_id} in room ${room_id}`);
                
                // Check admin reply requirement for users/agencies
                let canUpload = true;
                let errorMessage = null;
                
                if (sender_role === 'user' || sender_role === 'agency') {
                    const adminReplied = await hasAdminReplied(room_id, sender_id);
                    console.log(`[VOICE-STATUS] Admin replied check for ${sender_role} ${sender_id}: ${adminReplied}`);
                    if (!adminReplied) {
                        canUpload = false;
                        errorMessage = 'An admin must reply before you can upload voice messages.';
                    }
                }
                
                const status = {
                    can_upload: canUpload,
                    permission_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    },
                    assignment_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    },
                    block_toggle_status: { 
                        allowed: canUpload, 
                        error: errorMessage 
                    }
                };
                
                console.log(`[VOICE-STATUS] Sending status:`, status);
                socket.emit('voice_upload_status', status);

            } catch (error) {
                console.error('Voice upload status check error:', error);
                socket.emit('voice_upload_status_error', { 
                    error: 'Error checking voice upload status.' 
                });
            }
        });

        // --- Voice Upload ---
        socket.on('voice_upload', async (data) => {
            try {
                // data: { room_id, sender_id, file, file_name, sender_role }
                const { room_id, sender_id, sender_name, sender_role, file, file_name, file_type, file_size } = data;
                console.log(`[VOICE-UPLOAD] Voice upload request from ${sender_role} ${sender_id} in room ${room_id}`);

                // Verify room exists
                const room = await Room.findOne({ room_id });
                if (!room) {
                    socket.emit('voice-upload-error', { error: 'Room not found' });
                    return;
                }

                // Check if user is participant (for users/agencies) or admin (for admins/sub-admins)
                const isParticipant = room.participants.some(p => p.user_id === sender_id);
                const isAdmin = sender_role === 'admin' || sender_role === 'sub-admin';
                
                if (!isParticipant && !isAdmin) {
                    socket.emit('voice-upload-error', { error: 'Access denied - not a participant or admin' });
                    return;
                }

                // Only use admin reply check for users/agencies
                if (sender_role === 'user' || sender_role === 'agency') {
                    const adminReplied = await hasAdminReplied(room_id, sender_id);
                    console.log(`[VOICE-UPLOAD] Admin replied check for user ${sender_id}: ${adminReplied}`);
                    if (!adminReplied) {
                        socket.emit('voice-upload-error', { error: 'An admin must reply before you can upload voice messages.' });
                        return;
                    }
                }

                // Create uploads directory if it doesn't exist
                const uploadDir = path.join(__dirname, '../../uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const uniqueId = require('crypto').randomUUID();
                const fileName = `${timestamp}_${uniqueId}_${file_name}`;
                const filePath = path.join(uploadDir, fileName);

                // Save voice file to disk
                fs.writeFileSync(filePath, file, 'base64');

                // Create message record
                const newMessage = new Message({
                    room_id,
                    sender_id: parseInt(sender_id),
                    sender_name,
                    sender_role,
                    message: '[Voice Message]',
                    message_type: 'voice',
                    file_url: `/uploads/${fileName}`,
                    file_name: file_name,
                    file_size: file_size
                });

                await newMessage.save();

                // Update room's last message
                await Room.updateOne(
                    { room_id },
                    {
                        last_message: {
                            message: '[Voice Message]',
                            sender_name,
                            timestamp: new Date()
                        }
                    }
                );

                // Handle assignment logic for admin voice messages
                if (sender_role === 'admin' || sender_role === 'sub-admin') {
                    let assignment = await Assignment.findOne({ room_id, status: 'active' });
                    if (!assignment) {
                        assignment = new Assignment({
                            room_id,
                            assigned_to: parseInt(sender_id),
                            type: room.room_type === 'group' ? 'agency' : 'user',
                            status: 'active',
                            last_active: new Date()
                        });
                        await assignment.save();
                        
                        // Update user profile with assigned admin
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
                        
                        // Notify about assignment
                        io.emit('assignment-updated', { room_id, assigned_to: sender_id });
                        io.emit('user_assigned_to_admin', {
                            room_id,
                            user_id: room.participants.find(p => p.role === 'member')?.user_id,
                            admin_id: parseInt(sender_id),
                            admin_name: sender_name,
                            timestamp: new Date()
                        });
                    } else if (assignment.assigned_to === parseInt(sender_id)) {
                        // Update last_active timestamp
                        assignment.last_active = new Date();
                        await assignment.save();
                    }
                }

                // Broadcast message to room
                const msgObj = {
                    _id: newMessage._id,
                    room_id,
                    sender_id: parseInt(sender_id),
                    sender_name,
                    sender_role: sender_role,
                    message: '[Voice Message]',
                    message_type: 'voice',
                    file_url: `/uploads/${fileName}`,
                    file_name: file_name,
                    file_size: file_size,
                    is_read: false,
                    is_edited: false,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.updatedAt
                };

                io.to(room_id).emit('new-message', msgObj);

                // Send success response to sender
                socket.emit('voice-upload-success', {
                    message_id: newMessage._id,
                    file_url: `/uploads/${fileName}`,
                    file_name: file_name
                });

                console.log(`Voice message sent in room ${room_id} by ${sender_role} ${sender_id}`);

            } catch (error) {
                console.error('Voice upload error:', error);
                socket.emit('voice-upload-error', { 
                    error: 'Internal server error during voice upload.' 
                });
            }
        });

        // --- Topic Selection ---
        socket.on('select_topic', async (data) => {
            try {
                const { user_id, user_name, user_type, topic_id, topic_name } = data;

                // Create or update user profile
                await UserProfile.findOneAndUpdate(
                    { user_id: parseInt(user_id) },
                    {
                        user_name,
                        user_type,
                        last_seen: new Date(),
                        is_online: true
                    },
                    { upsert: true, new: true }
                );

                // Create room with topic
                const room_id = `room_${user_id}_${Date.now()}`;
                const newRoom = new Room({
                    room_id,
                    room_name: `${user_name} - ${topic_name}`,
                    room_type: 'private',
                    topic: {
                        topic_id,
                        topic_name
                    },
                    participants: [{
                        user_id: parseInt(user_id),
                        user_name,
                        role: 'member'
                    }]
                });

                await newRoom.save();

                // Join the room
                socket.join(room_id);

                socket.emit('topic_selected', {
                    room_id,
                    topic_name,
                    status: 'success'
                });

                // Notify admins about new chat request
                io.emit('new_chat_request', {
                    room_id,
                    user_id,
                    user_name,
                    user_type,
                    topic_name,
                    timestamp: new Date()
                });

            } catch (error) {
                socket.emit('topic_selection_error', { error: error.message });
            }
        });

        // --- User Profile Management ---
        socket.on('update_user_profile', async (data) => {
            try {
                const { user_id, user_name, user_type, is_authorized, profile_photo, agency_logo, email, phone } = data;

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
                    { upsert: true, new: true }
                );

                socket.emit('profile_updated', {
                    success: true,
                    data: profile
                });

                // Notify admins about profile update
                io.emit('user_profile_updated', {
                    user_id,
                    profile
                });

            } catch (error) {
                socket.emit('profile_update_error', { error: error.message });
            }
        });

        // --- Handle Predefined Messages ---
        socket.on('use_predefined_message', async (data) => {
            try {
                const { room_id, admin_id, message_id } = data;

                // Get predefined message
                const predefinedMessage = await PredefinedMessage.findById(message_id);
                if (!predefinedMessage) {
                    socket.emit('predefined_message_error', { error: 'Predefined message not found' });
                    return;
                }

                // Get room details
                const room = await Room.findOne({ room_id });
                if (!room) {
                    socket.emit('predefined_message_error', { error: 'Room not found' });
                    return;
                }

                // Create message using predefined content
                const newMessage = new Message({
                    room_id,
                    sender_id: parseInt(admin_id),
                    sender_name: 'Admin',
                    sender_role: 'admin',
                    message: predefinedMessage.message,
                    message_type: 'text'
                });

                await newMessage.save();

                // Update predefined message usage count
                await PredefinedMessage.findByIdAndUpdate(message_id, {
                    $inc: { usage_count: 1 },
                    last_used: new Date()
                });

                // Update room's last message
                await Room.updateOne(
                    { room_id },
                    {
                        last_message: {
                            message: predefinedMessage.message,
                            sender_name: 'Admin',
                            timestamp: new Date()
                        }
                    }
                );

                // Handle assignment logic
                let assignment = await Assignment.findOne({ room_id, status: 'active' });
                if (!assignment) {
                    assignment = new Assignment({
                        room_id,
                        assigned_to: parseInt(admin_id),
                        type: room.room_type === 'group' ? 'agency' : 'user',
                        status: 'active',
                        last_active: new Date()
                    });
                    await assignment.save();
                    
                    // Update user profile with assigned admin
                    if (room.room_type === 'private') {
                        const userParticipant = room.participants.find(p => p.role === 'member');
                        if (userParticipant) {
                            await UserProfile.findOneAndUpdate(
                                { user_id: userParticipant.user_id },
                                {
                                    assigned_admin: {
                                        admin_id: parseInt(admin_id),
                                        admin_name: 'Admin',
                                        assigned_at: new Date()
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                    
                    // Notify about assignment
                    io.emit('assignment-updated', { room_id, assigned_to: admin_id });
                    io.emit('user_assigned_to_admin', {
                        room_id,
                        user_id: room.participants.find(p => p.role === 'member')?.user_id,
                        admin_id: parseInt(admin_id),
                        admin_name: 'Admin',
                        timestamp: new Date()
                    });
                }

                // Broadcast message
                const msgObj = {
                    _id: newMessage._id,
                    room_id,
                    sender_id: parseInt(admin_id),
                    sender_name: 'Admin',
                    sender_role: 'admin',
                    message: predefinedMessage.message,
                    message_type: 'text',
                    is_read: false,
                    is_edited: false,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.updatedAt,
                    assigned_to: assignment?.assigned_to
                };

                io.to(room_id).emit('new-message', msgObj);
                socket.emit('predefined_message_sent', { success: true, message: newMessage });

            } catch (error) {
                socket.emit('predefined_message_error', { error: error.message });
            }
        });

        // --- Admin Assignment on First Reply ---
        socket.on('admin_first_reply', async (data) => {
            try {
                const { room_id, admin_id, admin_name, user_id } = data;

                // Create assignment
                const assignment = new Assignment({
                    room_id,
                    assigned_to: admin_id,
                    type: 'user',
                    status: 'active',
                    last_active: new Date()
                });
                await assignment.save();

                // Update user profile with assigned admin
                await UserProfile.findOneAndUpdate(
                    { user_id: parseInt(user_id) },
                    {
                        assigned_admin: {
                            admin_id: parseInt(admin_id),
                            admin_name,
                            assigned_at: new Date()
                        }
                    }
                );

                // Notify all admins about the assignment
                io.emit('user_assigned_to_admin', {
                    room_id,
                    user_id,
                    admin_id,
                    admin_name,
                    timestamp: new Date()
                });

            } catch (error) {
                socket.emit('assignment_error', { error: error.message });
            }
        });

        // --- Message Forwarding ---
        socket.on('forward_message', async (data) => {
            try {
                const { message_id, to_admin_id, from_admin_id, room_id } = data;

                const message = await Message.findById(message_id);
                if (!message) {
                    socket.emit('forward_error', { error: 'Message not found' });
                    return;
                }

                // Create new room for forwarded message
                const newRoomId = `forwarded_${Date.now()}`;
                const newRoom = new Room({
                    room_id: newRoomId,
                    room_name: `Forwarded from ${message.sender_name}`,
                    room_type: 'private',
                    participants: [{
                        user_id: parseInt(to_admin_id),
                        user_name: 'Admin',
                        role: 'admin'
                    }]
                });
                await newRoom.save();

                // Create forwarded message
                const forwardedMessage = new Message({
                    room_id: newRoomId,
                    sender_id: parseInt(from_admin_id),
                    sender_name: 'Admin',
                    recipient_id: parseInt(to_admin_id),
                    message: `[Forwarded] ${message.message}`,
                    message_type: 'text',
                    metadata: {
                        original_message_id: message_id,
                        forwarded_from: from_admin_id,
                        original_room_id: room_id
                    }
                });
                await forwardedMessage.save();

                socket.emit('message_forwarded', {
                    success: true,
                    new_room_id: newRoomId,
                    message: forwardedMessage
                });

            } catch (error) {
                socket.emit('forward_error', { error: error.message });
            }
        });

        // --- User Blocking ---
        socket.on('block_user', async (data) => {
            try {
                const { room_id, user_id, blocked_by, block_type, reason, expires_at } = data;

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

                // Notify the blocked user
                socket.to(room_id).emit('user_blocked', {
                    user_id,
                    block_type,
                    reason,
                    blocked_by
                });

                socket.emit('user_blocked_success', {
                    success: true,
                    data: blockEntry
                });

            } catch (error) {
                socket.emit('block_error', { error: error.message });
            }
        });

        // --- User Unblocking ---
        socket.on('unblock_user', async (data) => {
            try {
                const { room_id, user_id } = data;

                await BlockList.updateMany(
                    { room_id, user_id, is_active: true },
                    { is_active: false }
                );

                // Notify the unblocked user
                socket.to(room_id).emit('user_unblocked', {
                    user_id
                });

                socket.emit('user_unblocked_success', {
                    success: true
                });

            } catch (error) {
                socket.emit('unblock_error', { error: error.message });
            }
        });

        // --- Toggle User Permissions ---
        socket.on('toggle_message', async (data) => {
            try {
                const { room_id, user_id, toggled_by, is_enabled, reason, expires_at } = data;

                const toggleEntry = new ToggleList({
                    room_id,
                    user_id,
                    toggled_by,
                    toggle_type: 'message',
                    is_enabled,
                    reason,
                    expires_at: expires_at ? new Date(expires_at) : null,
                    is_active: true
                });

                await toggleEntry.save();

                // Notify the user about permission change
                socket.to(room_id).emit('message_permission_changed', {
                    user_id,
                    is_enabled,
                    reason
                });

                socket.emit('toggle_success', {
                    success: true,
                    data: toggleEntry
                });

            } catch (error) {
                socket.emit('toggle_error', { error: error.message });
            }
        });

        socket.on('toggle_call', async (data) => {
            try {
                const { room_id, user_id, toggled_by, is_enabled, reason, expires_at } = data;

                const toggleEntry = new ToggleList({
                    room_id,
                    user_id,
                    toggled_by,
                    toggle_type: 'call',
                    is_enabled,
                    reason,
                    expires_at: expires_at ? new Date(expires_at) : null,
                    is_active: true
                });

                await toggleEntry.save();

                // Notify the user about permission change
                socket.to(room_id).emit('call_permission_changed', {
                    user_id,
                    is_enabled,
                    reason
                });

                socket.emit('toggle_success', {
                    success: true,
                    data: toggleEntry
                });

            } catch (error) {
                socket.emit('toggle_error', { error: error.message });
            }
        });

        // --- Predefined Message Usage ---
        socket.on('use_predefined_message', async (data) => {
            try {
                const { room_id, admin_id, message_id } = data;

                const predefinedMessage = await PredefinedMessage.findById(message_id);
                if (!predefinedMessage) {
                    socket.emit('predefined_message_error', { error: 'Predefined message not found' });
                    return;
                }

                // Create new message using predefined content
                const newMessage = new Message({
                    room_id,
                    sender_id: parseInt(admin_id),
                    sender_name: 'Admin',
                    message: predefinedMessage.message,
                    message_type: 'text'
                });

                await newMessage.save();

                // Update usage count
                await PredefinedMessage.findByIdAndUpdate(message_id, {
                    $inc: { usage_count: 1 },
                    last_used: new Date()
                });

                // Broadcast message to room
                io.to(room_id).emit('new-message', newMessage);

                socket.emit('predefined_message_used', {
                    success: true,
                    message: newMessage
                });

            } catch (error) {
                socket.emit('predefined_message_error', { error: error.message });
            }
        });

        // Add after join-room and before 'signal' event:
        socket.on('call-initiate', async (data) => {
            console.log(`[SIGNAL] call-initiate: room_id=${data.room_id}, from=${data.from}, from_role=${data.from_role}, checkOnly=${data.checkOnly}`);
            // Enforce call rules only for user/agency initiating
            if (data.from_role === 'user' || data.from_role === 'agency') {
                const messages = await Message.find({ room_id: data.room_id }).sort({ createdAt: 1 });
                console.log('[CALL-DEBUG] Messages in room:', messages.map(m => ({ sender_id: m.sender_id, sender_role: m.sender_role, message: m.message, createdAt: m.createdAt })));
                const userMsgIdx = messages.findIndex(m => String(m.sender_id) === String(data.from) && (data.from_role === 'user' || data.from_role === 'agency'));
                console.log('[CALL-DEBUG] userMsgIdx:', userMsgIdx);
                if (userMsgIdx === -1) {
                    socket.emit('call-initiate-denied', { reason: 'You must send a message before starting a call.' });
                    console.log(`[SIGNAL] call-initiate denied: user has not sent a message (user_id=${data.from}, room=${data.room_id})`);
                    return;
                }
                const adminReply = messages.slice(userMsgIdx + 1).find(m => m.sender_role === 'admin' || m.sender_role === 'sub-admin');
                console.log('[CALL-DEBUG] adminReply:', adminReply);
                if (!adminReply) {
                    socket.emit('call-initiate-denied', { reason: 'An admin must reply before you can start a call.' });
                    console.log(`[SIGNAL] call-initiate denied: no admin reply (user_id=${data.from}, room=${data.room_id})`);
                    return;
                }
                console.log(`[SIGNAL] call-initiate allowed: user_id=${data.from}, room=${data.room_id}`);
            }
            // If checkOnly, just notify allowed
            if (data.checkOnly) {
                socket.emit('call-initiate');
                return;
            }
            // Relay call-initiate to other peer(s) in the room
            if (rooms[data.room_id]) {
                rooms[data.room_id].forEach(id => {
                    if (id !== socket.id) {
                        io.to(id).emit('call-initiate', { from: data.from });
                        console.log(`[SIGNAL] call-initiate relayed to socket=${id}, room=${data.room_id}`);
                    }
                });
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
