const Topic = require('../models/Topic');
const UserProfile = require('../models/UserProfile');

class TopicController {
    // Get all active topics
    async getAllTopics(req, res) {
        try {
            const topics = await Topic.find({ is_active: true })
                .select('name description category priority')
                .sort({ priority: 1, name: 1 });

            res.status(200).json({
                success: true,
                data: topics
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create a new topic
    async createTopic(req, res) {
        try {
            const { name, description, category, priority } = req.body;

            const existingTopic = await Topic.findOne({ name });
            if (existingTopic) {
                return res.status(400).json({ error: 'Topic with this name already exists' });
            }

            const newTopic = new Topic({
                name,
                description,
                category,
                priority
            });

            await newTopic.save();

            res.status(201).json({
                success: true,
                message: 'Topic created successfully',
                data: newTopic
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Assign topic to admin/sub-admin
    async assignTopicToAdmin(req, res) {
        try {
            const { topic_id, admin_id, admin_name } = req.body;

            const topic = await Topic.findById(topic_id);
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            // Check if admin is already assigned
            const isAlreadyAssigned = topic.assigned_admins.some(
                admin => admin.admin_id === admin_id
            );

            if (isAlreadyAssigned) {
                return res.status(400).json({ error: 'Admin is already assigned to this topic' });
            }

            topic.assigned_admins.push({
                admin_id,
                admin_name,
                assigned_at: new Date()
            });

            await topic.save();

            res.status(200).json({
                success: true,
                message: 'Topic assigned successfully',
                data: topic
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Remove admin assignment from topic
    async removeTopicAssignment(req, res) {
        try {
            const { topic_id, admin_id } = req.body;

            const topic = await Topic.findById(topic_id);
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            topic.assigned_admins = topic.assigned_admins.filter(
                admin => admin.admin_id !== admin_id
            );

            await topic.save();

            res.status(200).json({
                success: true,
                message: 'Topic assignment removed successfully',
                data: topic
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get topics assigned to specific admin
    async getTopicsByAdmin(req, res) {
        try {
            const { admin_id } = req.params;

            const topics = await Topic.find({
                'assigned_admins.admin_id': parseInt(admin_id),
                is_active: true
            }).select('name description category priority');

            res.status(200).json({
                success: true,
                data: topics
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update topic
    async updateTopic(req, res) {
        try {
            const { topic_id } = req.params;
            const updateData = req.body;

            const topic = await Topic.findByIdAndUpdate(
                topic_id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Topic updated successfully',
                data: topic
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete topic (soft delete)
    async deleteTopic(req, res) {
        try {
            const { topic_id } = req.params;

            const topic = await Topic.findByIdAndUpdate(
                topic_id,
                { is_active: false },
                { new: true }
            );

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Topic deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TopicController(); 