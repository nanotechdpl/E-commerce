const { createClient } = require('redis');

let redisClient;
let isConnected = false;

const connectRedis = async () => {
    try {
        const redisUrl = `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`;

        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('Redis max attempts reached');
                        return new Error('Retry limit exceeded');
                    }
                    return Math.min(retries * 100, 3000);
                }
            },
            password: process.env.REDIS_PASSWORD || undefined,
            database: Number(process.env.REDIS_DB || 0),
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
            isConnected = false;
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
            isConnected = true;
        });

        redisClient.on('ready', () => {
            console.log('Redis Client Ready');
            isConnected = true;
        });

        redisClient.on('end', () => {
            console.log('Redis Client Disconnected');
            isConnected = false;
        });

        await redisClient.connect();
        console.log('Redis connected successfully');
        isConnected = true;
        return redisClient;
    } catch (error) {
        console.error('Redis connection error:', error);
        isConnected = false;
        throw error;
    }
};

const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

const checkConnection = async () => {
    if (!isConnected || !redisClient) return false;
    try {
        await redisClient.ping();
        return true;
    } catch {
        return false;
    }
};

module.exports = {
    connectRedis,
    getRedisClient,
    checkConnection,
    isConnected: () => isConnected
};