const express = require('express');
const router = express.Router();
const FileUploadController = require('../controllers/fileUploadController');
const { validateFileUpload, validateFile, checkUploadPermission } = require('../middleware/fileUploadValidation');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'video/mp4': 'mp4',
        'video/mpeg': 'mpeg',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav'
    };

    if (allowedTypes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    }
});

// Middleware to validate required fields
const validateUploadRequest = (req, res, next) => {
    const { room_id, sender_id, sender_name, sender_role } = req.body;
    
    if (!room_id || !sender_id || !sender_name || !sender_role) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: room_id, sender_id, sender_name, sender_role'
        });
    }

    const validRoles = ['user', 'agency', 'admin', 'sub-admin'];
    if (!validRoles.includes(sender_role)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid sender_role. Must be one of: user, agency, admin, sub-admin'
        });
    }

    next();
};

// File upload route
router.post('/upload', 
    upload.single('file'), 
    validateFileUpload,
    validateFile,
    FileUploadController.uploadFile
);

// Get upload status for a user in a room
router.get('/status/:room_id/:sender_id/:sender_role', 
    checkUploadPermission,
    (req, res) => {
        res.json({
            success: true,
            data: req.uploadStatus
        });
    }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size too large. Maximum size is 50MB.'
            });
        }
        return res.status(400).json({
            success: false,
            error: 'File upload error: ' + error.message
        });
    }
    
    if (error.message.includes('File type')) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
    
    next(error);
});

module.exports = router; 