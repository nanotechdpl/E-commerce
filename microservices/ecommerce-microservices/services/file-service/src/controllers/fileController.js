
const File = require('../models/File');
const { uploadToGCS, deleteFromGCS, generateSignedUrl } = require('../config/storage');
const sharp = require('sharp');

class FileController {
    static async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file provided'
                });
            }

            const { upload_type = 'general', is_public = false } = req.body;
            const uploaded_by = req.user?.id || null; // Assuming user info from auth middleware

            // Process image if it's an image file
            let processedFile = req.file;
            if (req.file.mimetype.startsWith('image/') && req.body.resize) {
                try {
                    const { width, height, quality = 80 } = req.body;
                    const resizedBuffer = await sharp(req.file.buffer)
                        .resize(width ? parseInt(width) : null, height ? parseInt(height) : null, {
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: parseInt(quality) })
                        .toBuffer();

                    processedFile = {
                        ...req.file,
                        buffer: resizedBuffer,
                        size: resizedBuffer.length
                    };
                } catch (error) {
                    console.log('Image processing failed, using original:', error.message);
                }
            }

            // Upload to Google Cloud Storage
            const gcsResult = await uploadToGCS(processedFile, upload_type);

            // Save file metadata to database
            const fileData = {
                filename: gcsResult.filename,
                original_name: processedFile.originalname,
                mimetype: processedFile.mimetype,
                size: processedFile.size,
                gcs_bucket: gcsResult.bucket,
                gcs_key: gcsResult.gcsKey,
                gcs_url: gcsResult.gcsUrl,
                upload_type,
                uploaded_by,
                is_public: Boolean(is_public),
                metadata: {
                    uploadedAt: new Date().toISOString(),
                    userAgent: req.get('User-Agent'),
                    ipAddress: req.ip
                }
            };

            const savedFile = await File.create(fileData);

            // Log the upload action
            if (uploaded_by) {
                await File.logAccess(savedFile.id, uploaded_by, 'upload', req.ip, req.get('User-Agent'));
            }

            res.status(201).json({
                success: true,
                data: savedFile,
                message: 'File uploaded successfully'
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'File upload failed'
            });
        }
    }

    static async getFile(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user?.id || null;

            const file = await File.findById(id);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            // Log the access
            await File.logAccess(file.id, user_id, 'view', req.ip, req.get('User-Agent'));

            // Generate signed URL for private files
            let accessUrl = file.gcs_url;
            if (!file.is_public) {
                accessUrl = await generateSignedUrl(file.gcs_key, 60); // 1 hour expiration
            }

            res.json({
                success: true,
                data: {
                    ...file,
                    access_url: accessUrl
                }
            });

        } catch (error) {
            console.error('Get file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async downloadFile(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user?.id || null;

            const file = await File.findById(id);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            // Log the download
            await File.logAccess(file.id, user_id, 'download', req.ip, req.get('User-Agent'));

            // Generate signed URL for download
            const downloadUrl = await generateSignedUrl(file.gcs_key, 10); // 10 minutes expiration

            res.json({
                success: true,
                data: {
                    download_url: downloadUrl,
                    filename: file.original_name,
                    size: file.size,
                    mimetype: file.mimetype
                }
            });

        } catch (error) {
            console.error('Download error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getUserFiles(req, res) {
        try {
            const { user_id } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const files = await File.findByUploadedBy(user_id, parseInt(limit), offset);

            res.json({
                success: true,
                data: files,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Get user files error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getFilesByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const files = await File.findByType(type, parseInt(limit), offset);

            res.json({
                success: true,
                data: files,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Get files by type error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async searchFiles(req, res) {
        try {
            const { q: searchTerm } = req.query;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term is required'
                });
            }

            const files = await File.search(searchTerm, parseInt(limit), offset);

            res.json({
                success: true,
                data: files,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Search files error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteFile(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user?.id || null;

            const file = await File.findById(id);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            // Check if user owns the file (add your own authorization logic)
            if (file.uploaded_by && file.uploaded_by !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this file'
                });
            }

            // Soft delete in database
            await File.softDelete(id);

            // Delete from Google Cloud Storage
            const gcsDeleted = await deleteFromGCS(file.gcs_key);

            if (!gcsDeleted) {
                console.warn(`Failed to delete file from GCS: ${file.gcs_key}`);
            }

            // Log the deletion
            await File.logAccess(file.id, user_id, 'delete', req.ip, req.get('User-Agent'));

            res.json({
                success: true,
                message: 'File deleted successfully'
            });

        } catch (error) {
            console.error('Delete file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getFileStats(req, res) {
        try {
            const { user_id } = req.query;

            const stats = await File.getStats(user_id || null);

            res.json({
                success: true,
                data: {
                    ...stats,
                    total_size_mb: Math.round(stats.total_size / 1024 / 1024 * 100) / 100
                }
            });

        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateFileMetadata(req, res) {
        try {
            const { id } = req.params;
            const { metadata } = req.body;

            const file = await File.findById(id);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            const updatedFile = await File.updateMetadata(id, metadata);

            res.json({
                success: true,
                data: updatedFile,
                message: 'File metadata updated successfully'
            });

        } catch (error) {
            console.error('Update metadata error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = FileController;
  