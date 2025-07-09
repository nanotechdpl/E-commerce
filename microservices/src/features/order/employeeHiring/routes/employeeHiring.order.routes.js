const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder,
} = require("../controller/employeeHiring.order.controller");

const isAdmin = require("../../../../middlewares/isAdminMiddleWare");

const router = express.Router();
router.post("/",  createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderByID);
router.put("/:id", isAdmin, updateOrder);
router.delete("/:id", isAdmin, removeOrder);

module.exports = router;
