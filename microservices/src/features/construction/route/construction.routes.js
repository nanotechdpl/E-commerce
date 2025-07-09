const express = require('express');
const router = express.Router();
const constructionController = require('../controller/construction.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');
// const { upload } = require('../../../middlewares/upload');

// CRUD APIs for Construction
//BASE URL: /menu-services/construction
router.get('/', constructionController.getContructionsWithPaginationAndSearch);
router.get('/construction/category/secarch', constructionController.getContructionsWithSearch);
router.get('/service/categories', constructionController.getCategory);
router.post('/',isAdmin, constructionController.createConstruction);
router.put('/:id',isAdmin, constructionController.updateConstruction);
router.delete('/:id',isAdmin, constructionController.deleteConstruction);
router.put('/status/:id',isAdmin ,constructionController.changeConstructionStatus);




router.get("/quick-search", constructionController.searchConstruction);
router.get("/filter", constructionController.filterConstruction);


router.get('/:id', constructionController.getConstructionById);

module.exports = router;