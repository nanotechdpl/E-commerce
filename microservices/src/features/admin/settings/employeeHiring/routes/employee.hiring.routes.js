const express = require('express');
const { addEmployeeHiring,
     updateEmployeeHiring, 
     deleteEmployeeHiring, 
     getEmployeeHiringWithPaginationAndSearch,
     changeEployeeHiringStatus } = require('../controller/employee.hiring.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const employeeHiringRouter = express.Router();

employeeHiringRouter.post("/", isAdmin, addEmployeeHiring);
employeeHiringRouter.put("/:id", isAdmin, updateEmployeeHiring);
employeeHiringRouter.delete("/:id", isAdmin, deleteEmployeeHiring);
employeeHiringRouter.get("/", getEmployeeHiringWithPaginationAndSearch);
employeeHiringRouter.put('/status/:id',isAdmin ,changeEployeeHiringStatus);

module.exports = employeeHiringRouter;