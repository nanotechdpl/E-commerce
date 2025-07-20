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
const Agency = require('../../../../agency/model/agency.model');

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
router.post(
  "/user/analytics",
  adminretrievealluserdashboardController
);
router.post(
  "/user/agency/dashboard",
  async (req, res) => {
    try {
      const agencies = await Agency.find();
      
      // Calculate analytics
      const totalAgencies = agencies.length;
      const totalActiveUsers = agencies.filter(agency => agency.status === 'Active').length;
      const totalSuspendUsers = agencies.filter(agency => agency.status === 'Inactive').length;
      const totalblockusers = agencies.filter(agency => agency.status === 'Pending').length;
      const totalPendingDelete = 0; // TODO: Implement if needed
      
      res.status(200).json({
        status_code: 200,
        status: true,
        message: "User agency dashboard retrieved successfully.",
        data: {
          agencies,
          analytics: {
            totalAgencies,
            totalactiveusers: totalActiveUsers,
            totalSuspendUsers,
            totalblockusers,
            totalPendingDelete
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        status: false,
        message: "Failed to fetch agencies.",
        error: error.message
      });
    }
  }
);
router.delete(
  "/delete/account",
  admindeleteuseraccountController
);

module.exports = router;
