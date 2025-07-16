const { Pool } = require('pg');

const pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'order_db',
    user: process.env.DB_USER || 'order_user',
    password: process.env.DB_PASS || 'order_pass',
});

const connectDB = async () => {
    try {
        await pgPool.connect();
        console.log('PostgreSQL connected for Order service');

        // Create tables
        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL
      )
    `);

        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        order_id INTEGER,
        user_id INTEGER,
        agency_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        payment_method VARCHAR(20) DEFAULT 'paypal',
        paypal_order_id VARCHAR(100),
        type VARCHAR(30) DEFAULT 'order', -- order, security_deposit, annual_fee
        metadata JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


        // Insert sample products
        await pgPool.query(`
      INSERT INTO products (name, description, price, stock_quantity, category) 
      VALUES 
        ('Laptop', 'High-performance laptop', 999.99, 10, 'Electronics'),
        ('Phone', 'Smartphone with great camera', 599.99, 25, 'Electronics'),
        ('Book', 'Programming guide', 39.99, 100, 'Books')
      ON CONFLICT DO NOTHING
    `);

    } catch (err) {
        console.error('PostgreSQL connection error:', err);
    }
};

module.exports = { pgPool, connectDB };
