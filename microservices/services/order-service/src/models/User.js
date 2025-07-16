const { pgPool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create({ type, email, password, name }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (type, email, password, name)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pgPool.query(query, [type, email, hashedPassword, name]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pgPool.query(query, [email]);
        return result.rows[0];
    }

    static async validatePassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return false;
        return bcrypt.compare(password, user.password);
    }
}

module.exports = User; 