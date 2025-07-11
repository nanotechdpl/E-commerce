const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateAnyOrder,
  getOrderAnalytics,
} = require("../controller/admin.orderform.controller");

// Admin Routes
router.get("/", getAllOrders);
router.put("/:id", updateAnyOrder);
router.get("/analytics", getOrderAnalytics);

module.exports = router;
