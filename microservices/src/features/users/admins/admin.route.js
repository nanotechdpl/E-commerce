const express = require("express");
// import * as adminController from './admins.controller';
const adminController = require("./admins.controller");
const isAdmin = require("../../../middlewares/isAdminMiddleWare");

const router = express.Router();

router.get("/debug", (req, res) => {
  res.json({ message: "GET /admins/debug reached" });
});
router.post("/debug", (req, res) => {
  res.json({ message: "POST /admins/debug reached", body: req.body });
});

// Get all admins
router.get("/", adminController.getAll);

router.get("/:id", adminController.get);

router.post("/", adminController.create);

router.put("/:id", adminController.update);

router.delete("/:id", adminController.remove);

router.post("/login", adminController.login);

router.post("/forgot-password-request", adminController.requestPasswordReset);

router.post(
  "/verify-forgot-password-otp",
  adminController.verifyPasswordResetOTP
);

router.post("/reset-password", adminController.resetPassword);

router.post("/change-password", isAdmin, adminController.changePassword); // Apply authMiddleware

// export default router;
module.exports = router;
