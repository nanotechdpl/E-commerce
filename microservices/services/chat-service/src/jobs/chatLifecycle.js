const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const Message = require('../models/Message');
const Room = require('../models/Room');
const UserProfile = require('../models/UserProfile');
const Redis = require('ioredis');

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

// Helper to get last seen from Redis
async function getUserLastSeen(user_id, role) {
  if (redisClient) {
    try {
      const presence = await redisClient.hgetall(`presence:${role}:${user_id}`);
      return presence.last_seen ? parseInt(presence.last_seen) : null;
    } catch (error) {
      console.log('Redis getUserLastSeen error:', error.message);
      return null;
    }
  }
  return null;
}

// Inactivity thresholds (in minutes)
const ADMIN_INACTIVITY_MINUTES = 10; // or 15 for live chat
const MESSAGE_EXPIRATION_DAYS = 7;

// Assignment inactivity check (now uses Redis presence)
cron.schedule('*/2 * * * *', async () => {
  const now = Date.now();
  const threshold = now - ADMIN_INACTIVITY_MINUTES * 60 * 1000;
  const activeAssignments = await Assignment.find({ status: 'active' });
  for (const assignment of activeAssignments) {
    const lastSeen = await getUserLastSeen(assignment.assigned_to, 'admin'); // or 'sub-admin' if needed
    if (!lastSeen || lastSeen < threshold) {
      assignment.status = 'inactive';
      await assignment.save();
      console.log(`Assignment for room ${assignment.room_id} marked inactive due to admin inactivity.`);
    }
  }
});

// Message expiration check
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const expiration = new Date(now.getTime() - MESSAGE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
  const result = await Message.deleteMany({ createdAt: { $lt: expiration } });
  if (result.deletedCount > 0) {
    console.log(`Deleted ${result.deletedCount} expired messages.`);
  }
});

// Live chat: delete message history if user/agency offline for 15 minutes
cron.schedule('*/5 * * * *', async () => {
    try {
        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        
        // Find users who have been offline for more than 15 minutes
        const offlineUsers = await UserProfile.find({
            is_online: false,
            last_seen: { $lt: fifteenMinutesAgo },
            user_type: { $in: ['user', 'agency'] }
        });

        for (const user of offlineUsers) {
            // Find all rooms where this user is a participant
            const userRooms = await Room.find({
                'participants.user_id': user.user_id
            });

            for (const room of userRooms) {
                // Check if user has returned within 15 minutes
                const lastMessage = await Message.findOne({
                    room_id: room.room_id,
                    sender_id: user.user_id
                }).sort({ createdAt: -1 });

                if (lastMessage) {
                    const timeSinceLastMessage = now.getTime() - lastMessage.createdAt.getTime();
                    const fifteenMinutesInMs = 15 * 60 * 1000;

                    // If user hasn't sent a message in 15 minutes, delete all messages in the room
                    if (timeSinceLastMessage > fifteenMinutesInMs) {
                        const deletedMessages = await Message.deleteMany({
                            room_id: room.room_id
                        });

                        if (deletedMessages.deletedCount > 0) {
                            console.log(`Deleted ${deletedMessages.deletedCount} messages for user ${user.user_id} in room ${room.room_id} due to 15-minute inactivity`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in 15-minute message deletion job:', error);
    }
});

module.exports = {}; 