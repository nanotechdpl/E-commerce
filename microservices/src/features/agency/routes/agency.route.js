const express = require("express");
const {
  sentOTPForAgencyCreation,
  getExistingUser,
  registerAgency,
  uploadMiddleware,
  verifyRegistrationOTP,
  loginAgency,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  updateAgency,
  changePassword,
  getAgencyById,
  sentOTPFor2FA,
  getAllAgencies,
  getAgencyExceptPending,
  createAgency,
  getSubscriptionFee,
} = require("../controller/agency.controller");
const isAuthenticateAgency = require("../../../middlewares/isAgencyMiddleWare");

const router = express.Router();

router.get("/home-agency", getAgencyExceptPending);
router.post("/check-existing-user", getExistingUser);
router.post("/agency-creation-otp", sentOTPForAgencyCreation);
// router.post("/create", uploadMiddleware, registerAgency);
router.post("/create-agency", createAgency);
router.post("/verify-registration-otp", verifyRegistrationOTP);

router.post("/verify-2fa-otp", sentOTPFor2FA);
router.post("/login-agency", loginAgency);

router.get("/get-all", getAllAgencies);
router.get("/:id", getAgencyById);
router.put("/update/:id", updateAgency);

router.post("/forgot-password-request", requestPasswordReset);
router.post("/verify-forgot-password-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPassword);

router.post("/change-password", isAuthenticateAgency, changePassword);

module.exports = router;
