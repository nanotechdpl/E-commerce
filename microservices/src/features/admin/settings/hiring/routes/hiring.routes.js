const express = require('express');
const { addHiring,
     updateHiring, 
     deleteeHiring, 
     getHiringWithPaginationAndSearch,
     getHiringWitSearch,
     getCategory,
     changeHiringStatus } = require('../controller/hiring.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const employeeHiringRouter = express.Router();

employeeHiringRouter.post("/", isAdmin, addHiring);
employeeHiringRouter.put("/:id", isAdmin, updateHiring);
employeeHiringRouter.delete("/:id", isAdmin, deleteeHiring);
employeeHiringRouter.get("/", getHiringWithPaginationAndSearch);
employeeHiringRouter.get("/service/categories", getHiringWitSearch);
employeeHiringRouter.get("/employeeHiring/category/secarch", getCategory);
employeeHiringRouter.put('/status/:id',isAdmin ,changeHiringStatus);

module.exports = employeeHiringRouter;