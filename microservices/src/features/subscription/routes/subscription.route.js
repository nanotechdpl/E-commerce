const express = require("express");
const router = express.Router();

const subscriptionController = require("../controller/subscription.controller");
const subPayController = require("../controller/sub-pay.controller");

router.get("/", subscriptionController.getSubscriptionFee);

router.post("/pay/create", subPayController.createPayment);
router.post("/pay/capture", subPayController.captureOrder);
router.get("/pay/admin-payment-history", subPayController.getPaymentHistory);
router.get("/pay/user-payment-history", subPayController.getUserPaymentHistory);

module.exports = router;
