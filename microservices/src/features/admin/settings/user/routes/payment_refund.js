const {
  adminupdateuserrefundstatusController,
  adminretrievesingleuserrefundController,
  adminuserrefunddashboardController,
  adminupdateuserpaymentstatusController,
  adminretrievesingleuserpaymentController,
  adminuserpaymentdashboardController,
} = require("../controller/payment");

const router = require("express").Router();

const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

router.use(isAdmin);

//payment
router.post(
  "/payment/dashboard",
  adminuserpaymentdashboardController
);
router.post(
  "/single/payment",
  adminretrievesingleuserpaymentController
);
router.post(
  "/update/payment/status",
  adminupdateuserpaymentstatusController
);

//refund
router.post(
  "/return/dashboard",
  adminuserrefunddashboardController
);
router.post(
  "/single/return",
  adminretrievesingleuserrefundController
);
router.post(
  "/update/return/status",
  adminupdateuserrefundstatusController
);

module.exports = router;
