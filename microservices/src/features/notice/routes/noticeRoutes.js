const express = require("express");
const router = express.Router();
const noticeController = require("../controller/noticeController");
const isAdmin = require("../../../middlewares/isAdminMiddleWare");
const { upload } = require("../../../middlewares/upload");

router.get("/search", noticeController.searchNotice);
// Create a new notice with file upload
router.post("/",isAdmin, noticeController.createNotice);

// Get all notices
router.get("/", noticeController.getAllNotices);

// Update a notice with file upload
router.put("/:id",isAdmin,  noticeController.updateNotice);  
router.put("/visible/:id",isAdmin,  noticeController.changeNoticeVisible);   

// Delete a notice
router.delete("/:id",isAdmin, noticeController.deleteNotice);

module.exports = router;
