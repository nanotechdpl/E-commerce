// const express = require("express");

// const {
//   createUser,
//   verifyRegistrationOTP,
//   getUsers,
//   loginUser,
//   deleteAccount,
//   profileUpdate,
//   requestPasswordReset,
//   resetPassword,
//   verifyPasswordResetOTP,
//   changePassword,
//   sentOTPFor2FA,
//   getUserById
// } = require("../controllers/userController");
// const { isUser } = require("../middlewares/userAuthenticationMiddleWare");

// const router = express.Router();

// router.get("/", getUsers);
// router.post("/register", createUser);
// router.post("/verify-registration-otp", verifyRegistrationOTP); // New route for OTP verification
// router.post("/login", loginUser);

// router.post("/verify-two-fa-otp", sentOTPFor2FA);

// router.get("/:id", getUserById);

// router.post("/delete", isUser, deleteAccount);
// router.put("/:id", isUser, profileUpdate);

// router.post("/forgot-password-request", requestPasswordReset);
// router.post("/verify-forgot-password-otp", verifyPasswordResetOTP);
// router.post("/reset-password", resetPassword);

// router.post("/change-password", isUser, changePassword)

// module.exports = router;

const express = require("express");

const {
  createUser,
  verifyRegistrationOTP,
  getUsers,
  loginUser,
  deleteAccount,
  profileUpdate,
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOTP,
  changePassword,
  sentOTPFor2FA,
  getUserById,
  getUserInfoByMail,
  accountSecurity,

  recoverAccount,
  addContact,
  verifyAddContact,
  deleteContact,
  changePrimaryContact,
  verifySuspendedInfo,
  enable2FA,
  disable2FA,

} = require("../controllers/userController");
const { isUser } = require("../middlewares/userAuthenticationMiddleWare");

const router = express.Router();

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/verify-registration-otp", verifyRegistrationOTP);

router.post("/verify-2fa-otp", sentOTPFor2FA);
router.post("/login", loginUser);

router.get("/:id", getUserById);

router.post("/delete", isUser, deleteAccount);
router.put("/:id", isUser, profileUpdate);

router.post("/forgot-password-request", requestPasswordReset);
router.post("/verify-forgot-password-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPassword);

router.post("/change-password", isUser, changePassword);

// two factor
router.get("/verify-user/:email", getUserInfoByMail);
router.patch("/account-security/:email", accountSecurity);

router.post("/recover-account", recoverAccount);

router.post("/add-contact", isUser, addContact);
router.post("/verify-add-contact", isUser, verifyAddContact);
router.post("/delete-contact", isUser, deleteContact);
router.post("/change-primary-contact", isUser, changePrimaryContact);
router.post("/verify-suspended-info", isUser, verifySuspendedInfo);
router.post("/enable-2fa", isUser, enable2FA);
router.post("/disable-2fa", isUser, disable2FA);


module.exports = router;
