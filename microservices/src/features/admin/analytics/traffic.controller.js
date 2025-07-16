const TrafficLog = require('../../../models/TrafficLog');

// Log a traffic event
exports.logTraffic = async (req, res) => {
  try {
    const { userId, deviceType, location, ip, isNewVisitor } = req.body;
    const log = await TrafficLog.create({ userId, deviceType, location, ip, isNewVisitor });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get traffic stats by device type
exports.getStatsByDevice = async (req, res) => {
  try {
    const stats = await TrafficLog.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get traffic stats by location
exports.getStatsByLocation = async (req, res) => {
  try {
    const stats = await TrafficLog.aggregate([
      { $group: { _id: '$location.country', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get visitor history (last month, average, etc.)
exports.getVisitorHistory = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const visitors = await TrafficLog.find({ visitedAt: { $gte: lastMonth } });
    res.json({ success: true, data: visitors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 