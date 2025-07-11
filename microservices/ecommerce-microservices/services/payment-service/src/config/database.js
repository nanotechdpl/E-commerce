const { Pool } = require('pg');

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'payment_db',
  user: process.env.DB_USER || 'payment_user',
  password: process.env.DB_PASS || 'payment_pass',
});

const connectDB = async () => {
  try {
    await pgPool.connect();
    console.log('PostgreSQL connected for Payment service');

    // Create tables
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        payment_id VARCHAR(100) UNIQUE NOT NULL,
        order_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        payment_method VARCHAR(50) DEFAULT 'paypal',
        paypal_order_id VARCHAR(255),
        paypal_capture_id VARCHAR(255),
        transaction_id VARCHAR(255),
        failure_reason TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        paypal_payment_method_id VARCHAR(255),
        type VARCHAR(20) NOT NULL DEFAULT 'paypal',
        email VARCHAR(255),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id SERIAL PRIMARY KEY,
        refund_id VARCHAR(100) UNIQUE NOT NULL,
        payment_id VARCHAR(100) REFERENCES payments(payment_id),
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        paypal_refund_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

module.exports = { pgPool, connectDB };
