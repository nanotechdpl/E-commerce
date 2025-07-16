const { pgPool } = require('../config/database');

class OrderCommunication {
    static async addMessage({ order_id, sender_id, content_type, content }) {
        const query = `
            INSERT INTO order_communications (order_id, sender_id, content_type, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pgPool.query(query, [order_id, sender_id, content_type, content]);
        return result.rows[0];
    }

    static async getMessages(order_id) {
        const query = 'SELECT * FROM order_communications WHERE order_id = $1 ORDER BY timestamp ASC';
        const result = await pgPool.query(query, [order_id]);
        return result.rows;
    }
}

module.exports = OrderCommunication; 