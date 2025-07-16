const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res) {
        try {
            const { type, email, password, name } = req.body;
            const user = await User.create({ type, email, password, name });
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const valid = await User.validatePassword(email, password);
            if (!valid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign({ user_id: user.user_id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ success: true, token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = UserController; 