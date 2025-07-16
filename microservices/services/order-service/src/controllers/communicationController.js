const OrderCommunication = require('../models/OrderCommunication');

class CommunicationController {
    static async addMessage(req, res) {
        try {
            const message = await OrderCommunication.addMessage(req.body);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getMessages(req, res) {
        try {
            const messages = await OrderCommunication.getMessages(req.params.order_id);
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = CommunicationController; 