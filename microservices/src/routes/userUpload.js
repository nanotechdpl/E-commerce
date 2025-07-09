const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/fileUploadController');
const isAdmin = require('../middlewares/isAdminMiddleWare');


// Route to handle file upload
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
