const Notice = require("../model/noticeModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });

exports.upload = multer({ storage });

// Create a new notice
exports.createNotice = async (req, res) => {
  try {

    const { title,photo,date } = req.body;
 
    if (!title || !photo )  {
      return res.status(400).json({
        message: "Title and photo are required to create a notice.",
        status: 400,
        success: false,
      });
    }

    const newNotice = new Notice({
      title,photo,date
    })

    const result = await newNotice.save();

    
    res.status(201).json({ message: "Notice added successfully", data: newNotice,
      status: 201, success: true
     });
  } catch (error) {
    res.status(500).json({ error: error.message,
      status: 500, success: false, message: "Internal server error"
     });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
 try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      Notice.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Notice.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "Notice fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

// Update a notice
exports.updateNotice = async (req, res) => {
  try {
    const {id} = req.params;
    const { title,photo,date } = req.body;

    const result = await Notice.findOneAndUpdate(
      id,
      { title,photo,date },
      { new: true }
    )

    if (!result) {
      return res.status(404).json({ message: "Notice not found", status: 404, success: false });
    }
    

    
    res.status(200).json({ message: "Notice updated successfully", data: result, status: 200, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message,
      status: 500, success: false, message: "Internal server error"
     });
  }
};

exports.changeNoticeVisible = async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;

    const existing = await Notice.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
        status: 404,
        error: "Notice not found",
      });
    }
    // Validate status value

    if (!["active", "inactive"].includes(visible)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visible value. Allowed values are 'active' or 'inactive'.",
        status: 400,
        error: "Invalid visible value",
      });
    }

    const updated = await Notice.findByIdAndUpdate(
      id,
      { visible },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Employee not found" ,
          status: 404,
          error: "Employee not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Employee visible updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Employee visible",
      error: error.message,
      status: 500,
    });
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found", status: 404, success: false });
    }
    res.status(200).json({ message: "Notice deleted successfully"
, status: 200, success: true

     });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchNotice = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Construct a case-insensitive regex search for string fields
    const searchRegex = new RegExp(query, "i");

    // Convert date queries properly
    const dateQuery = !isNaN(Date.parse(query)) ? new Date(query) : null;

    const results = await Notice.find({
      $or: [
        { noticeBannerTitle: searchRegex },
        { noticeBannerImage: searchRegex },
        { title: searchRegex },
        { document: searchRegex },
        { url: searchRegex },
        dateQuery !== null ? { date: { $gte: dateQuery } } : null,
      ].filter(Boolean), // Remove null conditions
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

  
