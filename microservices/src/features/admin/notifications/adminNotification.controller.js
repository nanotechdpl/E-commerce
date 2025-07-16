const AdminNotification = require('../../../models/AdminNotification');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message, relatedId, userId, meta } = req.body;
    const notification = await AdminNotification.create({ type, message, relatedId, userId, meta });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all notifications (optionally filter by type, unread, etc.)
exports.getNotifications = async (req, res) => {
  try {
    const { type, isRead } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    const notifications = await AdminNotification.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await AdminNotification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 