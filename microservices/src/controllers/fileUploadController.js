const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Directory path for saving uploaded files temporarily
const uploadDir = "uploads/";

// Ensure the uploads directory exists (create if missing)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to uploads/ directory
  },
  filename: function (req, file, cb) {
    // Add unique suffix to avoid file name collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter — allow only images and PDFs
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") || 
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files and PDFs are allowed!"), false);
  }
};

// Configure multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Max 10 MB
  fileFilter: fileFilter,
});

// Controller function to handle file upload
const uploadFile = async (req, res) => {
  try {
    // Support multiple possible field names: file, image, photo
    const file =
      req.file ||
      (req.files && req.files.file && req.files.file[0]) ||
      (req.files && req.files.image && req.files.image[0]) ||
      (req.files && req.files.photo && req.files.photo[0]);

    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded or invalid file type.",
      });
    }

    // Upload file to Cloudinary with resource_type auto (handles images, PDFs, etc)
    const uploaded = await uploadOnCloudinary(file.path, {
      resource_type: "auto",
    });

    if (!uploaded?.url) {
      return res.status(500).json({
        status: 500,
        message: "File upload to Cloudinary failed.",
      });
    }

    // Optionally delete the file from local storage after upload
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    // Respond with success and Cloudinary URL
    res.status(200).json({
      status: 200,
      message: "File uploaded successfully.",
      fileUrl: uploaded.url,
      resource_type: uploaded.resource_type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Export multer middleware and controller function
module.exports = {
  upload,
  uploadFile,
};
