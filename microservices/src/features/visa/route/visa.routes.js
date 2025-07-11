const express = require('express');
const router = express.Router();
const visaController = require('../controller/visa.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');
const { upload } = require('../../../middlewares/upload');

// CRUD APIs for Visa
router.get('/', visaController.getAllVisasWithPaginationAndSearch);
router.get('/visa/category/secarch', visaController.getAllVisasWithSearch);
router.get('/service/categories', visaController.getCategory);
router.put('/:id',isAdmin, visaController.updateVisa);
router.delete('/:id',isAdmin, visaController.deleteVisa);
router.put('/status/:id',isAdmin ,visaController.changeVisaStatus);



router.get('/:id', visaController.getVisaById);



router.get("/filter", visaController.searchVisa);
router.get("/quick-search", visaController.quickSearchVisa);
router.post('/', isAdmin, upload.single("image"), visaController.createVisa);


module.exports = router;