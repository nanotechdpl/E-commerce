const express = require('express')
const { uploadRealEstate, getRealEstate, updateRealEstateHeaderView,
    deleteRealEstateHeaderView, addRealEstateHeaderView, searchRealEstate,deleteRealEstate } = require('../controller/realEstateController')
const isAdmin = require("../../../middleware/isAdminMiddleWare");

const router =  express.Router()

router.post('/new',isAdmin,uploadRealEstate)
 
router.get('/all',getRealEstate)

router.get('/search', searchRealEstate);

router.delete('/delete/:id',isAdmin, deleteRealEstate);

router.post('/add/header-view',isAdmin,addRealEstateHeaderView);

router.post('/update/header-view',isAdmin,updateRealEstateHeaderView);

router.delete('/delete/header-view/:bannerId',isAdmin,deleteRealEstateHeaderView);



module.exports = router
