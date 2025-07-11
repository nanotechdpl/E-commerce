const express = require("express");
const {
  uploadRealEstate,
  getRealEstate,
  searchRealEstate,
  deleteRealEstate,
  getRealEstateById,
  updateRealEstate,
  quickSearchRealEstate,
  getRealEstateTypes,
  AddRealEstate,
  updatedVisibleRealEstate,
  getRealEstateType
} = require("../controller/real.estate.controller");
const isAdmin = require("../../../middlewares/isAdminMiddleWare");


const router = express.Router();

//Base URL:
router.post("/",  AddRealEstate);
router.get("/", getRealEstate);
router.get("/realEstate/type", getRealEstateType);
router.put("/:id",  updateRealEstate);
router.put("/visible/:id",  updatedVisibleRealEstate);
router.delete("/:id", deleteRealEstate);




router.get('/types', getRealEstateTypes);
router.get("/filter", searchRealEstate);
router.get("/quick-search", quickSearchRealEstate);
router.get("/:id", getRealEstateById);






module.exports = router;
