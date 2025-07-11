const express = require('express');
const router = express.Router();
const travellingController = require('../controller/travelling.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');
const { upload } = require('../../../middlewares/upload');


// CRUD APIs for Travelling
router.get('/', travellingController.getAllTravellingsWithPaginationAndSearch);
router.get('/travelling/category/secarch', travellingController.getAllTravellingsWithSearch);
router.get('/service/categories', travellingController.getCategory);
router.put('/:id',isAdmin,  travellingController.updateTravelling);
router.delete('/:id',isAdmin, travellingController.deleteTravelling);
router.post('/',isAdmin,travellingController.createTravelling);
router.put('/status/:id',isAdmin ,travellingController.changeTravellingStatus);





// router.get("/search", travellingController.searchTravelling);
router.get("/filter", travellingController.filterTravelling);
router.get("/quick-search", travellingController.searchTravelling);


router.get('/:id', travellingController.getTravellingById);


module.exports = router;