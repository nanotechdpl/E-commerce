const {
  adminretrievealluserorderdashboardController,
  adminretrievealluserpaymentdashboardController,
  adminretrievealluserrefunddashboardController,
  adminretrievealluserdashboardController,
  adminretrievesingleuserController,
  admindeleteuseraccountController,
  adminupdateuserstatusController,
} = require("../controller/user.mgn");

const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const router = require("express").Router();

router.use(isAdmin);

//order dashbaord
router.post(
  "/all/user/dashboard",
  adminretrievealluserdashboardController
);
router.post(
  "/single/user/dashboard",
  adminretrievesingleuserController
);
router.post(
  "/update/user/status",
  adminupdateuserstatusController
);
router.post(
  "/user/order/dashboard",
  adminretrievealluserorderdashboardController
);
router.post(
  "/user/payment/dashboard",
  adminretrievealluserpaymentdashboardController
);
router.post(
  "/user/return/dashboard",
  adminretrievealluserrefunddashboardController
);
router.delete(
  "/delete/account",
  admindeleteuseraccountController
);

module.exports = router;
