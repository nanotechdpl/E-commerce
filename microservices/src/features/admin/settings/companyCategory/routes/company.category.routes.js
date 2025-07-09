const express = require("express");
const {
  createCompanyCategory,
  getAllCompanyCategorys,
  getCompanyCategoryById,
  updateCompanyCategory,
  deleteCompanyCategory,
} = require("../controller/company.category.controller");
const isAdmin = require("../../../../../middlewares/isAdminMiddleWare");


const router = express.Router();

// Create
router.post("/", isAdmin, createCompanyCategory);

// Read All
router.get("/", getAllCompanyCategorys);

// Read One
router.get("/:id", getCompanyCategoryById);

// Update
router.put("/:id", isAdmin, updateCompanyCategory);

// Delete
router.delete("/:id", isAdmin, deleteCompanyCategory);

module.exports = router;
