const TechnicalOrder = require('../models/TechnicalOrder');

class TechnicalOrderController {
    static async create(req, res) {
        try {
            const technicalOrder = await TechnicalOrder.create(req.body);
            res.status(201).json({ success: true, data: technicalOrder });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getByOrderId(req, res) {
        try {
            const technicalOrder = await TechnicalOrder.getByOrderId(req.params.order_id);
            if (!technicalOrder) {
                return res.status(404).json({ success: false, message: 'Technical order not found' });
            }
            res.json({ success: true, data: technicalOrder });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = TechnicalOrderController; 