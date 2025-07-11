const Message = require('../models/Message');
const Room = require('../models/Room');
const Assignment = require('../models/Assignment');
const BlockList = require('../models/BlockList');
const ToggleList = require('../models/ToggleList');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FileUploadController {
    
    /**
     * Validate file upload permissions for users/agencies
     * All users can upload files without restrictions
     */
    static async validateFileUploadPermissions(roomId, senderId, senderRole) {
        try {
            // All users can upload files without restrictions
            return { allowed: true };

        } catch (error) {
            console.error('File upload permission validation error:', error);
            return {
                allowed: false,
                error: 'Error validating file upload permissions.'
            };
        }
    }

    /**
     * Check if user is assigned to the chat room
     */
    static async validateAssignment(roomId, senderId, senderRole) {
        // Assignment check removed: always allow
        return { allowed: true };
    }

    /**
     * Check if user is blocked or file upload is disabled
     */
    static async validateBlockAndToggle(roomId, senderId) {
        try {
            // Check if user is blocked from file upload
            const isBlocked = await BlockList.findOne({
                user_id: senderId,
                room_id: roomId,
                is_active: true,
                block_type: { $in: ['file', 'all'] }
            });

            if (isBlocked) {
                return {
                    allowed: false,
                    error: 'File upload is blocked for you in this chat.'
                };
            }

            // Check if file upload is toggled off for user
            const isToggled = await ToggleList.findOne({
                user_id: senderId,
                room_id: roomId,
                toggle_type: 'file',
                is_enabled: false
            });

            if (isToggled) {
                return {
                    allowed: false,
                    error: 'File upload is disabled for you in this chat.'
                };
            }

            return { allowed: true };

        } catch (error) {
            console.error('Block/toggle validation error:', error);
            return {
                allowed: false,
                error: 'Error validating file upload restrictions.'
            };
        }
    }

    /**
     * Validate file type and size
     */
    static validateFile(file) {
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

        const maxFileSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes[file.mimetype]) {
            return {
                valid: false,
                error: `File type ${file.mimetype} is not allowed.`
            };
        }

        if (file.size > maxFileSize) {
            return {
                valid: false,
                error: `File size exceeds maximum limit of ${maxFileSize / (1024 * 1024)}MB.`
            };
        }

        return { valid: true };
    }

    /**
     * Save file to local storage (for demo purposes)
     * In production, this should use cloud storage
     */
    static async saveFile(file, roomId) {
        try {
            const uploadDir = path.join(__dirname, '../../uploads', roomId);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}_${uuidv4()}_${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);

            // Save file
            fs.writeFileSync(filePath, file.buffer);

            return {
                success: true,
                fileName,
                filePath,
                fileUrl: `/uploads/${roomId}/${fileName}`
            };

        } catch (error) {
            console.error('File save error:', error);
            return {
                success: false,
                error: 'Failed to save file.'
            };
        }
    }

    /**
     * Main file upload handler
     */
    static async uploadFile(req, res) {
        try {
            const { room_id, sender_id, sender_name, sender_role } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file provided.'
                });
            }

            // Validate file
            const fileValidation = this.validateFile(file);
            if (!fileValidation.valid) {
                return res.status(400).json({
                    success: false,
                    error: fileValidation.error
                });
            }

            // Check if room exists
            const room = await Room.findOne({ room_id });
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat room not found.'
                });
            }

            // All users can upload files without restrictions
            // No permission, assignment, or block/toggle validation needed

            // Save file
            const saveResult = await this.saveFile(file, room_id);
            if (!saveResult.success) {
                return res.status(500).json({
                    success: false,
                    error: saveResult.error
                });
            }

            // Create message record
            const newMessage = new Message({
                room_id,
                sender_id: parseInt(sender_id),
                sender_name,
                sender_role,
                message: `[File: ${file.originalname}]`,
                message_type: 'file',
                file_url: saveResult.fileUrl,
                file_name: file.originalname,
                file_size: file.size,
                file_type: file.mimetype
            });

            await newMessage.save();

            // Update room's last message
            await Room.updateOne(
                { room_id },
                {
                    last_message: {
                        message: `[File: ${file.originalname}]`,
                        sender_name,
                        timestamp: new Date()
                    }
                }
            );

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully.',
                data: {
                    message_id: newMessage._id,
                    file_url: saveResult.fileUrl,
                    file_name: file.originalname,
                    file_size: file.size,
                    file_type: file.mimetype,
                    uploaded_at: newMessage.createdAt
                }
            });

        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error during file upload.'
            });
        }
    }

    /**
     * Get file upload status for a user in a room
     */
    static async getUploadStatus(req, res) {
        try {
            const { room_id, sender_id, sender_role } = req.params;

            // Check if room exists
            const room = await Room.findOne({ room_id });
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat room not found.'
                });
            }

            // All users can upload files without restrictions
            res.json({
                success: true,
                data: {
                    can_upload: true,
                    permission_status: { allowed: true },
                    assignment_status: { allowed: true },
                    block_toggle_status: { allowed: true }
                }
            });

        } catch (error) {
            console.error('Upload status error:', error);
            res.status(500).json({
                success: false,
                error: 'Error getting upload status.'
            });
        }
    }
}

module.exports = FileUploadController; 