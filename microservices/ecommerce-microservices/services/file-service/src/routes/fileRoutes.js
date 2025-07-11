const express = require('express');
const FileController = require('../controllers/fileController');
const { upload } = require('../config/storage');
const validate = require('../middleware/validation');

const router = express.Router();

// File upload route
router.post('/upload', upload.single('file'), validate.uploadFile, FileController.uploadFile);

// File retrieval routes
router.get('/search', FileController.searchFiles);
router.get('/stats', FileController.getFileStats);
router.get('/type/:type', FileController.getFilesByType);
router.get('/user/:user_id', FileController.getUserFiles);
router.get('/:id', FileController.getFile);
router.get('/:id/download', FileController.downloadFile);

// File management routes
router.patch('/:id/metadata', validate.updateMetadata, FileController.updateFileMetadata);
router.delete('/:id', FileController.deleteFile);

module.exports = router;