const PredefinedMessage = require('../models/PredefinedMessage');

class PredefinedMessageController {
    // Get predefined messages for admin
    async getPredefinedMessages(req, res) {
        try {
            const { admin_id } = req.params;
            const { category } = req.query;

            const filter = {
                admin_id: parseInt(admin_id),
                is_active: true
            };

            if (category) {
                filter.category = category;
            }

            const messages = await PredefinedMessage.find(filter)
                .select('title message category usage_count last_used')
                .sort({ usage_count: -1, title: 1 });

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create predefined message
    async createPredefinedMessage(req, res) {
        try {
            const { admin_id, admin_name, title, message, category } = req.body;

            const newMessage = new PredefinedMessage({
                admin_id: parseInt(admin_id),
                admin_name,
                title,
                message,
                category
            });

            await newMessage.save();

            res.status(201).json({
                success: true,
                message: 'Predefined message created successfully',
                data: newMessage
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update predefined message
    async updatePredefinedMessage(req, res) {
        try {
            const { message_id } = req.params;
            const updateData = req.body;

            const message = await PredefinedMessage.findByIdAndUpdate(
                message_id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!message) {
                return res.status(404).json({ error: 'Predefined message not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Predefined message updated successfully',
                data: message
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete predefined message (soft delete)
    async deletePredefinedMessage(req, res) {
        try {
            const { message_id } = req.params;

            const message = await PredefinedMessage.findByIdAndUpdate(
                message_id,
                { is_active: false },
                { new: true }
            );

            if (!message) {
                return res.status(404).json({ error: 'Predefined message not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Predefined message deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Use predefined message (increment usage count)
    async usePredefinedMessage(req, res) {
        try {
            const { message_id } = req.params;

            const message = await PredefinedMessage.findByIdAndUpdate(
                message_id,
                {
                    $inc: { usage_count: 1 },
                    last_used: new Date()
                },
                { new: true }
            );

            if (!message) {
                return res.status(404).json({ error: 'Predefined message not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Predefined message used successfully',
                data: message
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get most used predefined messages
    async getMostUsedMessages(req, res) {
        try {
            const { admin_id } = req.params;
            const { limit = 10 } = req.query;

            const messages = await PredefinedMessage.find({
                admin_id: parseInt(admin_id),
                is_active: true
            })
                .select('title message category usage_count last_used')
                .sort({ usage_count: -1 })
                .limit(parseInt(limit));

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get predefined messages by category
    async getMessagesByCategory(req, res) {
        try {
            const { admin_id, category } = req.params;

            const messages = await PredefinedMessage.find({
                admin_id: parseInt(admin_id),
                category,
                is_active: true
            })
                .select('title message usage_count last_used')
                .sort({ usage_count: -1, title: 1 });

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all categories for admin
    async getCategories(req, res) {
        try {
            const { admin_id } = req.params;

            const categories = await PredefinedMessage.distinct('category', {
                admin_id: parseInt(admin_id),
                is_active: true
            });

            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PredefinedMessageController(); 