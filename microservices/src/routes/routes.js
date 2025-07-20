const express = require("express");
const userRoutes = require("./userRoutes");
const router = express.Router();

const { admins } = require("../features/users/admins");
const { orders } = require("../features/order");
const uploader = require("./userUpload");

const {
  userOrderRequestRoutes,
  adminOrderRequestRoutes,
} = require("../features/order-forms");
const { visaRoutes } = require("../features/visa");
const { constructionRoutes } = require("../features/construction");
const { realEstateRoutes } = require("../features/real-estate");
const { messageRoutes, callRoutes } = require("../features/livechat");

const { threeCardsRoutes } = require("../features/admin/settings/threeCards");
const { FiveCardsRoutes } = require("../features/admin/settings/fiveCards");
const { fourCardsRoutes } = require("../features/admin/settings/fourCards");
const {
  socialMediaIconRoutes,
} = require("../features/admin/settings/socialMediaIcons");
const { hiringRoutes } = require("../features/admin/settings/employeeHiring");
const { hiringEmployeesRoutes } = require("../features/admin/settings/hiring");
const {
  serviceGalleryRoutes,
} = require("../features/admin/settings/servicegallery");
const { contuctUsRoutes } = require("../features/admin/settings/contactUs");
const { counterRoutes } = require("../features/admin/settings/counterSection");
const {
  footerLinkRoutes,
} = require("../features/admin/settings/footerTextAndLink");
const {
  globalLocationRoutes,
} = require("../features/admin/settings/globalLocation");
const { globalOrbitRoutes } = require("../features/admin/settings/globalOrbit");
const {
  paymentIconRoutes,
} = require("../features/admin/settings/paymentIcons");
const { secirityRoutes } = require("../features/admin/settings/securitypage");
const {
  stackHolderRoutes,
} = require("../features/admin/settings/stakeHolders");
const { subscribesRoutes } = require("../features/admin/settings/subscribes");
const { agencyRoutes } = require("../features/agency");
const { technicalRoutes } = require("../features/technical");
const { businessRoutes } = require("../features/business");
const { exportRoutes } = require("../features/export");

// Order Routes
const { technicalOrderRoutes } = require("../features/order/Technical");
const { contructionOrderRoutes } = require("../features/order/construction");
const {
  employeeHiringOrderRoutes,
} = require("../features/order/employeeHiring");
const { BusinessOrderRoutes } = require("../features/order/business");
const { EstateOrderRoutes } = require("../features/order/realEstate");
const { InputExportOrderRoutes } = require("../features/order/InputExport");
const {
  visaTravellingOrderRoutes,
} = require("../features/order/visa-travelling");

const { travellingRoutes } = require("../features/travellling");
const { employeeRoutes } = require("../features/users/employees");
//25-3-25:
const fiveCardsRoutes = require("../features/admin/settings/fiveCards/routes/fiveCardsRoutes");
//26-3-25:
const noticeRouter = require("../features/notice/routes/noticeRoutes");
const blogRouter = require("../features/blog/routes/blogRoute");
const {
  supportIconRoutes,
} = require("../features/admin/settings/supportIconLogo");
const {
  companyCategoryRoutes,
} = require("../features/admin/settings/companyCategory");

//27-03-25:
const adminPaymentRefundRouter = require("../features/admin/settings/user/routes/payment_refund");
const adminOrderRouter = require("../features/admin/settings/user/routes/order");
const adminDashboardRouter = require("../features/admin/settings/user/routes/dashboard");
const { adminuserpaymentdashboardController } = require("../features/admin/settings/user/controller/payment");


const trafficAnalyticsRoutes = require("../features/admin/analytics/traffic.routes");
const adminNotificationRoutes = require("../features/admin/notifications/adminNotification.routes");


router.use("/users", userRoutes);
router.use("/agency", agencyRoutes);
router.use("/admins", admins);
router.use("/orders", orders);

// Order Routes
router.use("/order/technical", technicalOrderRoutes);
router.use("/order/contruction", contructionOrderRoutes);
router.use("/order/input-export", InputExportOrderRoutes);
router.use("/order/employeeHiring", employeeHiringOrderRoutes);
router.use("/order/business", BusinessOrderRoutes);
router.use("/order/estate-order", EstateOrderRoutes);
router.use("/order/visa-travelling", visaTravellingOrderRoutes);

router.use("/user-order-request", userOrderRequestRoutes);
router.use("/admin-order-request", adminOrderRequestRoutes);
router.use("/employers", employeeRoutes);

router.use("/menu-services/visa", visaRoutes);
router.use("/menu-services/construction", constructionRoutes);
router.use("/menu-services/real-estate", realEstateRoutes);
router.use("/menu-services/hiring", hiringEmployeesRoutes);
router.use("/menu-services/technical", technicalRoutes);
router.use("/menu-services/business", businessRoutes);
router.use("/menu-services/export", exportRoutes);
router.use("/menu-services/traveling", travellingRoutes);

router.use("/file-upload", uploader);

router.use("/admin/home/three-cards", threeCardsRoutes);
router.use("/admin/home/five-cards", FiveCardsRoutes);
router.use("/admin/home/four-cards", fourCardsRoutes);
router.use("/admin/home/social-icons", socialMediaIconRoutes);
router.use("/admin/home/hiring", hiringRoutes);
router.use("/admin/home/service-gallery", serviceGalleryRoutes);
router.use("/admin/home/support-icons", supportIconRoutes);
router.use("/admin/home/company-category", companyCategoryRoutes);

router.use("/admin/contact-us", contuctUsRoutes);
router.use("/admin/counter", counterRoutes);
router.use("/admin/footer-link", footerLinkRoutes);
router.use("/admin/global-location", globalLocationRoutes);

router.use("/admin/global-orbit", globalOrbitRoutes);
router.use("/admin/payment-icon", paymentIconRoutes);
router.use("/admin/security", secirityRoutes);

router.use("/admin/stock-holder", stackHolderRoutes);
router.use("/admin/subscriber", subscribesRoutes);

router.use("/admin/analytics/traffic", trafficAnalyticsRoutes);
router.use("/admin/notifications", adminNotificationRoutes);


router.use("/messages", messageRoutes);
router.use("/calls", callRoutes);

router.use("/admin/home/five-cards", fiveCardsRoutes);

router.use("/notice", noticeRouter);
router.use("/blog", blogRouter);

//27-03-25:
router.use("/admin", adminPaymentRefundRouter);
router.use("/admin", adminOrderRouter);
router.use("/admin", adminDashboardRouter);
router.post("/factory-app/admin/payment-tracker", adminuserpaymentdashboardController);

// 10-06-2025:
router.use("/pay-order", require("../features/payment/routes"));
// 1-07-2025:
router.use(
  "/subscription",
  require("../features/subscription").subscriptionRouter
);

module.exports = router;
