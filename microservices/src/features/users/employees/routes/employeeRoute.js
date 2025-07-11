const express = require("express");
const {
  registerEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  changeEmployeeStatus,
  getEmployeeAnalytics,
  getTopEmployees,
  searchEmployees,
} = require("../controller/employeesController");

const { isUser } = require("../../../../middlewares/userAuthenticationMiddleWare");
const isAdmin = require('../../../../middlewares/isAdminMiddleWare');

const router = express.Router();

router.post("/newEmployee", registerEmployee);
router.get("/search", searchEmployees);

router.get("/allEmployees", getEmployees);
router.put("/:id",  updateEmployee);
router.put("/status/:id",  changeEmployeeStatus);

router.get("/:employeeId", getEmployeeById);



router.delete("/:id", deleteEmployee);
router.get("/analytics", getEmployeeAnalytics);
router.get("/get/top-employees", getTopEmployees);


module.exports = router;
