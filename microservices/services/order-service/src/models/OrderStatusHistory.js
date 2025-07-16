const { pgPool } = require('../config/database');

class OrderStatusHistory {
    static async addStatus(order_id, status, changed_by) {
        const query = `
            INSERT INTO order_status_history (order_id, status, changed_by)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pgPool.query(query, [order_id, status, changed_by]);
        return result.rows[0];
    }

    static async getHistory(order_id) {
        const query = 'SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY changed_at ASC';
        const result = await pgPool.query(query, [order_id]);
        return result.rows;
    }
}

module.exports = OrderStatusHistory; 