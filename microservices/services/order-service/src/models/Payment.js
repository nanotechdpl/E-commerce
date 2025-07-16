const { pgPool } = require('../config/database');
const crypto = require('crypto');

class Payment {
    static async create(paymentData) {
        const {
            order_id,
            user_id,
            agency_id,
            amount,
            currency = 'USD',
            payment_method = 'paypal',
            paypal_order_id,
            type = 'order', // order, security_deposit, annual_fee
            metadata = {}
        } = paymentData;

        const payment_id = `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

        const query = `
      INSERT INTO payments (payment_id, order_id, user_id, agency_id, amount, currency, payment_method, paypal_order_id, type, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

        const result = await pgPool.query(query, [
            payment_id, order_id, user_id, agency_id, amount, currency, payment_method, paypal_order_id, type, JSON.stringify(metadata)
        ]);
        return result.rows[0];
    }

    static async getByOrder(order_id) {
        const query = 'SELECT * FROM payments WHERE order_id = $1';
        const result = await pgPool.query(query, [order_id]);
        return result.rows;
    }

    static async updateStatus(payment_id, status) {
        const query = `
            UPDATE payments SET status = $1, timestamp = CURRENT_TIMESTAMP
            WHERE payment_id = $2 RETURNING *
        `;
        const result = await pgPool.query(query, [status, payment_id]);
        return result.rows[0];
    }
}

module.exports = Payment; 