const FileUploadController = require('../controllers/fileUploadController');

/**
 * Middleware to validate file upload permissions
 * All users can upload files without restrictions
 */
const validateFileUpload = async (req, res, next) => {
    try {
        const { room_id, sender_id, sender_role } = req.body;

        if (!room_id || !sender_id || !sender_role) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: room_id, sender_id, sender_role'
            });
        }

        // All users can upload files without restrictions
        req.fileUploadValidation = {
            permission: { allowed: true },
            assignment: { allowed: true },
            blockToggle: { allowed: true }
        };

        next();

    } catch (error) {
        console.error('File upload validation middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Error validating file upload permissions'
        });
    }
};

/**
 * Middleware to validate file type and size
 */
const validateFile = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file provided'
            });
        }

        const fileValidation = FileUploadController.validateFile(req.file);
        if (!fileValidation.valid) {
            return res.status(400).json({
                success: false,
                error: fileValidation.error
            });
        }

        next();

    } catch (error) {
        console.error('File validation middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Error validating file'
        });
    }
};

/**
 * Middleware to check if user can upload files (without file validation)
 * All users can upload files without restrictions
 */
const checkUploadPermission = async (req, res, next) => {
    try {
        const { room_id, sender_id, sender_role } = req.params;

        if (!room_id || !sender_id || !sender_role) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: room_id, sender_id, sender_role'
            });
        }

        // All users can upload files without restrictions
        req.uploadStatus = {
            can_upload: true,
            permission_status: { allowed: true },
            assignment_status: { allowed: true },
            block_toggle_status: { allowed: true }
        };

        next();

    } catch (error) {
        console.error('Upload permission check middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Error checking upload permissions'
        });
    }
};

module.exports = {
    validateFileUpload,
    validateFile,
    checkUploadPermission
}; 