const { pgPool } = require('../config/database');

class TechnicalOrder {
    static async create({ order_id, project_type, priority, expected_end_date, documents }) {
        const query = `
            INSERT INTO technical_orders (order_id, project_type, priority, expected_end_date, documents)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pgPool.query(query, [order_id, project_type, priority, expected_end_date, documents]);
        return result.rows[0];
    }

    static async getByOrderId(order_id) {
        const query = 'SELECT * FROM technical_orders WHERE order_id = $1';
        const result = await pgPool.query(query, [order_id]);
        return result.rows[0];
    }
}

module.exports = TechnicalOrder; 