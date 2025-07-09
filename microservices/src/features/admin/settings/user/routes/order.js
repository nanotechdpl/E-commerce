// Import necessary modules
const express = require('express');
const router = express.Router();
const {
  adminupdateuserorderstatusController,
  adminupdateuserordersignatoryController,
  adminuserorderdashboardController,
  adminretrievesingleuserorderController,
  adminupdateuserorderprofitController,
} = require('../controller/order');

const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

router.use(isAdmin);

router.post(
  '/order/dashboard',
  adminuserorderdashboardController
);

router.post(
  '/single/order',
  adminretrievesingleuserorderController
);


router.post(
  '/update/order/status',
  adminupdateuserorderstatusController
);

router.post(
  '/update/order/profit',
  adminupdateuserorderprofitController
);

router.post(
  '/update/order/signatory',
  adminupdateuserordersignatoryController
);

module.exports = router;
