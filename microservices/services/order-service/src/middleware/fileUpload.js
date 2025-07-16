const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

module.exports = upload; 