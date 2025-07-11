const { Pool } = require('pg');
const redis = require('redis');

const pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'customer_db',
    user: process.env.DB_USER || 'customer_user',
    password: process.env.DB_PASS || 'customer_pass',
});

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const connectDB = async () => {
    try {
        await pgPool.connect();
        console.log('PostgreSQL connected for Customer service');

        // Create tables if they don't exist
        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
    }
};

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected for Customer service');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
};

module.exports = { pgPool, redisClient, connectDB, connectRedis };
