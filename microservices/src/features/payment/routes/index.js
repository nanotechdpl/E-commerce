const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");

router.post("/create", paymentController.createPayment);
router.post("/capture", paymentController.captureOrder);
router.get("/admin-payment-history", paymentController.getPaymentHistory);
router.get("/user-payment-history", paymentController.getUserPaymentHistory);

module.exports = router;
