const { pgPool } = require('../config/database');
const crypto = require('crypto');

class Refund {
    static async create(refundData) {
        const { payment_id, amount, reason, paypal_refund_id } = refundData;
        const refund_id = `REF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

        const query = `
      INSERT INTO refunds (refund_id, payment_id, amount, reason, paypal_refund_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const result = await pgPool.query(query, [refund_id, payment_id, amount, reason, paypal_refund_id]);
        return result.rows[0];
    }

    static async findByPaymentId(payment_id) {
        const query = 'SELECT * FROM refunds WHERE payment_id = $1';
        const result = await pgPool.query(query, [payment_id]);
        return result.rows;
    }

    static async updateStatus(refund_id, status) {
        const query = 'UPDATE refunds SET status = $1 WHERE refund_id = $2 RETURNING *';
        const result = await pgPool.query(query, [status, refund_id]);
        return result.rows[0];
    }
}

module.exports = Refund;

