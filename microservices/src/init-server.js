require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;



// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // add timestamp to avoid filename conflicts
  }
});

// Set up the multer upload instance with storage settings
const upload = multer({ storage: storage });

// Handle file upload route
app.post('/api/v1/factory-app/admin/file-upload/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`, // returning file path after successful upload
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
