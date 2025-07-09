const express = require('express');
const router = express.Router();
const exportController = require('../controller/export.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');
const { upload } = require('../../../middlewares/upload');


// CRUD APIs for Export
router.get('/', exportController.getAllExportsWithPaginationAndSearch);
router.get('/export/category/secarch', exportController.getAllExportsWithSearch);
router.get('/service/categories', exportController.getCategory);
router.delete('/:id',isAdmin, exportController.deleteExport);
router.put('/:id',isAdmin, upload.single("image"), exportController.updateExport);
router.put('/status/:id',isAdmin ,exportController.changeExportsStatus);


router.get("/quick-search", exportController.searchExport);
router.get("/filter", exportController.filterExport);
router.post('/',isAdmin, upload.single("image"), exportController.createExport);
router.get('/', exportController.getAllExports);
router.get('/:id', exportController.getExportById);


module.exports = router;