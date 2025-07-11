const OrderForm = require("../model/orderform.model");

// Get all orders with optional filters
exports.getAllOrders = async (req, res) => {
  try {
    let filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      filters.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }
    const orders = await OrderForm.find(filters);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update any order details
exports.updateAnyOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics for orders
exports.getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await OrderForm.countDocuments();
    const categoryBreakdown = await OrderForm.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const recentOrders = await OrderForm.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({
      success: true,
      analytics: { totalOrders, categoryBreakdown, recentOrders },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
