const { pgPool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Customer {
    static async create(customerData) {
        const { email, password, first_name, last_name, phone, address } = customerData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
      INSERT INTO customers (email, password, first_name, last_name, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, address, created_at
    `;

        const result = await pgPool.query(query, [email, hashedPassword, first_name, last_name, phone, address]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM customers WHERE email = $1';
        const result = await pgPool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, email, first_name, last_name, phone, address, created_at FROM customers WHERE id = $1';
        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const query = `
      UPDATE customers 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING id, email, first_name, last_name, phone, address, updated_at
    `;

        const result = await pgPool.query(query, [id, ...values]);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM customers WHERE id = $1 RETURNING id';
        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Customer;