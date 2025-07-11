const express = require('express');
const router = express.Router();
const technicalController = require('../controller/technical.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');



// CRUD APIs for Technical
router.get('/', technicalController.getAllTechnicalsWithPaginationAndSearch);
router.get('/technical/category/secarch', technicalController.getAllTechnicalsWithSearch);
router.put('/status/:id' ,technicalController.changeTechnicalStatus);
router.get('/:id', technicalController.getTechnicalById);
router.put('/:id',isAdmin,  technicalController.updateTechnical);
router.delete('/:id',isAdmin, technicalController.deleteTechnical);




router.get('/service/categories', technicalController.getCategory);
router.get("/filter", technicalController.filterTechnical);
router.get("/quick-search", technicalController.searchTechnical);
router.post('/',isAdmin, technicalController.createTechnical);




module.exports = router;