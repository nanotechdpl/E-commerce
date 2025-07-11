const { pgPool } = require('../config/database');
const crypto = require('crypto');

class Payment {
    static async create(paymentData) {
        const {
            order_id,
            customer_id,
            amount,
            currency = 'USD',
            payment_method = 'paypal',
            paypal_order_id,
            metadata = {}
        } = paymentData;

        const payment_id = `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

        const query = `
      INSERT INTO payments (payment_id, order_id, customer_id, amount, currency, payment_method, paypal_order_id, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

        const result = await pgPool.query(query, [
            payment_id, order_id, customer_id, amount, currency, payment_method, paypal_order_id, JSON.stringify(metadata)
        ]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM payments WHERE id = $1';
        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async findByPaymentId(payment_id) {
        const query = 'SELECT * FROM payments WHERE payment_id = $1';
        const result = await pgPool.query(query, [payment_id]);
        return result.rows[0];
    }

    static async findByPaypalOrderId(paypal_order_id) {
        const query = 'SELECT * FROM payments WHERE paypal_order_id = $1';
        const result = await pgPool.query(query, [paypal_order_id]);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = 'SELECT * FROM payments WHERE order_id = $1';
        const result = await pgPool.query(query, [order_id]);
        return result.rows;
    }

    static async updateStatus(payment_id, status, capture_id = null, failure_reason = null) {
        const query = `
      UPDATE payments 
      SET status = $1, paypal_capture_id = $2, failure_reason = $3, updated_at = CURRENT_TIMESTAMP 
      WHERE payment_id = $4 
      RETURNING *
    `;

        const result = await pgPool.query(query, [status, capture_id, failure_reason, payment_id]);
        return result.rows[0];
    }

    static async findByCustomerId(customer_id, limit = 10, offset = 0) {
        const query = `
      SELECT * FROM payments 
      WHERE customer_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [customer_id, limit, offset]);
        return result.rows;
    }

    static async getAll(limit = 10, offset = 0) {
        const query = `
      SELECT * FROM payments 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

        const result = await pgPool.query(query, [limit, offset]);
        return result.rows;
    }
}

module.exports = Payment;
