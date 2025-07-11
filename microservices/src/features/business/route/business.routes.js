const express = require('express');
const router = express.Router();
const businessController = require('../controller/business.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');


// CRUD APIs for Technical
router.get('/', businessController.getAllBusinesssWithPaginationAndSearch);
router.get('/business/category/secarch', businessController.getAllBusinesssWithSearch);
router.get('/service/categories', businessController.getCategory);
router.put('/status/:id' ,businessController.changeBusinessStatus);
router.put('/:id',isAdmin,  businessController.updateBusiness);
router.delete('/:id',isAdmin, businessController.deleteBusiness);
router.post('/',isAdmin, businessController.createBusiness);






module.exports = router;