const express = require("express");
const {
  createTechnicalOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder,
} = require("../controller/technical.order.controller");

const isAdmin = require("../../../../middlewares/isAdminMiddleWare");
 

const router = express.Router();
router.post("/", createTechnicalOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderByID);
router.put("/:id", isAdmin, updateOrder);
router.delete("/:id", isAdmin, removeOrder);

module.exports = router;
