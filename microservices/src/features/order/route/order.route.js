const express = require("express");
const orderController = require("../controller/order.controller");
const isAdmin = require("../../../middlewares/isAdminMiddleWare");
const { upload } = require("../../../middlewares/upload");
const { isUser } = require("../../../middlewares/userAuthenticationMiddleWare");

const router = express.Router();

// admin
router.get("/", orderController.getAllOrdersStats);

router.get("/user", orderController.getUserAllOrders);

router.get("/:id", orderController.getOrderByID);

router.post(
  "/",
  isAdmin,
  upload.single("photo"),
  orderController.createNewOrder
);

router.put(
  "/:id",
  isAdmin,
  upload.single("photo"),
  orderController.updateOrder
);

//  Update order status and fields by serviceType + orderId
router.put(
  "/update-by-id-and-status/:orderId/:serviceType",
  isUser,
  orderController.updateOrderByIdAndStatus
);
//  get order status and fields by serviceType + orderId
router.get(
  "/get-by-id-and-service-type/:orderId/:serviceType",
  isAdmin,
  orderController.getOrderByIdAndServiceType
);

router.get(
  "/orderInfo/:orderId",
  isAdmin,
  orderController.getOrderInfoByOrderId
);

router.delete("/:id", isAdmin, orderController.removeOrder);

module.exports = router;
