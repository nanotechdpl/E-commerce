const { pgPool } = require('../config/database');

class Product {
    static async getAll(limit = 20, offset = 0) {
        const query = `
      SELECT * FROM products 
      ORDER BY name 
      LIMIT $1 OFFSET $2
    `;

        const result = await pgPool.query(query, [limit, offset]);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async updateStock(id, quantity) {
        const query = `
      UPDATE products 
      SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;

        const result = await pgPool.query(query, [quantity, id]);
        return result.rows[0];
    }

    static async search(searchTerm, limit = 20, offset = 0) {
        const query = `
      SELECT * FROM products 
      WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
      ORDER BY name 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [`%${searchTerm}%`, limit, offset]);
        return result.rows;
    }
}

module.exports = Product;
