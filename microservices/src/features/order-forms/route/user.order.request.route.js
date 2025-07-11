const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controller/orderform.controller");
const { isUserForRequestOrder, isUser } = require("../../../middlewares/userAuthenticationMiddleWare");

// Routes
//user-order-request
// router.post("/", isUser, isUserForRequestOrder, createOrder);
// router.get("/", isUser, getUserOrders);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
