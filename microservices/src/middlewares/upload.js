const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
//const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
},
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and random string
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
   // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, filename);
  }
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Please upload a suitable image."));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});

// Helper function to get file URL
const getFileUrl = (req, filename, module = 'common') => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${baseUrl}/uploads/${module}/${filename}`;
};

module.exports = {
  upload,
  getFileUrl
};
