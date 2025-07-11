const { pgPool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Order {
    static async create(orderData) {
        const client = await pgPool.connect();

        try {
            await client.query('BEGIN');

            const { customer_id, items, shipping_address } = orderData;
            const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Calculate total
            let total_amount = 0;
            for (const item of items) {
                const productQuery = 'SELECT price, stock_quantity FROM products WHERE id = $1';
                const productResult = await client.query(productQuery, [item.product_id]);

                if (productResult.rows.length === 0) {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }

                const product = productResult.rows[0];
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ID ${item.product_id}`);
                }

                total_amount += product.price * item.quantity;
            }

            // Create order
            const orderQuery = `
        INSERT INTO orders (order_number, customer_id, total_amount, shipping_address)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

            const orderResult = await client.query(orderQuery, [order_number, customer_id, total_amount, shipping_address]);
            const order = orderResult.rows[0];

            // Create order items and update stock
            const orderItems = [];
            for (const item of items) {
                const productQuery = 'SELECT name, price FROM products WHERE id = $1';
                const productResult = await client.query(productQuery, [item.product_id]);
                const product = productResult.rows[0];

                const itemTotal = product.price * item.quantity;

                const itemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

                const itemResult = await client.query(itemQuery, [
                    order.id, item.product_id, product.name, item.quantity, product.price, itemTotal
                ]);

                orderItems.push(itemResult.rows[0]);

                // Update stock
                await client.query(
                    'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                    [item.quantity, item.product_id]
                );
            }

            await client.query('COMMIT');

            return { ...order, items: orderItems };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findById(id) {
        const orderQuery = 'SELECT * FROM orders WHERE id = $1';
        const orderResult = await pgPool.query(orderQuery, [id]);

        if (orderResult.rows.length === 0) {
            return null;
        }

        const order = orderResult.rows[0];

        const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';
        const itemsResult = await pgPool.query(itemsQuery, [id]);

        return { ...order, items: itemsResult.rows };
    }

    static async findByCustomerId(customer_id, limit = 10, offset = 0) {
        const query = `
      SELECT * FROM orders 
      WHERE customer_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [customer_id, limit, offset]);
        return result.rows;
    }

    static async updateStatus(id, status) {
        const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;

        const result = await pgPool.query(query, [status, id]);
        return result.rows[0];
    }

    static async getAll(limit = 10, offset = 0) {
        const query = `
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

        const result = await pgPool.query(query, [limit, offset]);
        return result.rows;
    }
}

module.exports = Order;
