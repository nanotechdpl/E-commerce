const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key file
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// Multer configuration for memory storage
const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Define allowed file types
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
    storage: multerStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    }
});

// Helper function to generate unique filename
const generateFileName = (originalName) => {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const uuid = uuidv4().split('-')[0];
    return `${name}_${timestamp}_${uuid}${ext}`;
};

// Upload file to Google Cloud Storage
const uploadToGCS = async (file, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        const fileName = generateFileName(file.originalname);
        const gcsKey = `${folder}/${fileName}`;
        const gcsFile = bucket.file(gcsKey);

        const stream = gcsFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    originalName: file.originalname,
                    uploadedAt: new Date().toISOString()
                }
            }
        });

        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('finish', async () => {
            try {
                // Make file public if needed (optional)
                // await gcsFile.makePublic();

                const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${gcsKey}`;

                resolve({
                    filename: fileName,
                    gcsKey: gcsKey,
                    gcsUrl: publicUrl,
                    bucket: process.env.GCS_BUCKET_NAME
                });
            } catch (error) {
                reject(error);
            }
        });

        stream.end(file.buffer);
    });
};

// Delete file from Google Cloud Storage
const deleteFromGCS = async (gcsKey) => {
    try {
        await bucket.file(gcsKey).delete();
        return true;
    } catch (error) {
        console.error('Error deleting file from GCS:', error);
        return false;
    }
};

// Generate signed URL for private file access
const generateSignedUrl = async (gcsKey, expirationMinutes = 60) => {
    try {
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + expirationMinutes * 60 * 1000,
        };

        const [url] = await bucket.file(gcsKey).getSignedUrl(options);
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
};

module.exports = {
    upload,
    uploadToGCS,
    deleteFromGCS,
    generateSignedUrl,
    bucket
};