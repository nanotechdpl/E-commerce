const Export = require("../model/export.model");

exports.getAllExportsWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [exports, totalData] = await Promise.all([
      Export.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Export.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data: exports, 
         totalData,
         success: true,
         status: 200,
         message: "Export fetched successfully",
         }
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        { 
          message: "Internal server error",
           error: error.message ,
           status: 500,
           success:false,
          }
      );
  }
};
exports.getAllExportsWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [exports, totalData] = await Promise.all([
      Export.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Export.countDocuments({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data: exports, 
         totalData,
         success: true,
         status: 200,
         message: "Export fetched successfully",
         }
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        { 
          message: "Internal server error",
           error: error.message ,
           status: 500,
           success:false,
          }
      );
  }
};

exports.getCategory = async (req, res) => {
  try {
    // Find all unique categories from the Technical collection
    const categories = await Export.distinct("category");
    res.status(200).json({
      title: "Get Export Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Export Stacks",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};



exports.changeExportsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await Export.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Export not found",
        status: 404,
        error: "Export not found",
      });
    }
    // Validate status value

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Allowed values are 'active' or 'inactive'.",
        status: 400,
        error: "Invalid status value",
      });
    }

    const updated = await Export.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Export not found" ,
          status: 404,
          error: "Export not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Export status updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Export status",
      error: error.message,
      status: 500,
    });
  }
};

// Create a new export
exports.createExport = async (req, res) => {
  try {
   const { title, description, category, tag, photo } = req.body;

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Export Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description, photo and category fields are needed to upload export service.",
      });
      return;
    }
   

    const exportSave = new Export({ 
     title,
      description,
      category,
      photo,
      tag 
    });
    const savedExport = await exportSave.save();

    res
      .status(201)
      .json({ message: "Export created successfully", data: savedExport ,
        success: true,
        status: 201,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating export", error: error.message ,status: 500 ,success: false });
  }
};

// Update a export by ID
exports.updateExport = async (req, res) => {
  try {
    const { id } = req.params;
   const { title, description, photo, category } = req.body;

   
    const updatedExport = await Export.findByIdAndUpdate(
      id,
      { title, description, photo, category },
      { new: true }
    );

    if (!updatedExport) {
      return res.status(404).json({ message: "Export not found" });
    }

    res
      .status(200)
      .json({ message: "Export updated successfully", data: updatedExport, success: true, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating export", error: error.message , status: 500, success: false });
  }
};

// Delete a export by ID
exports.deleteExport = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Export.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ message: "Export not found" });
    }

    res.status(200).json({ message: "Export deleted successfully" , success: true, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting export", error: error.message, status: 500, success: false });
  }
};










// Get all exports (with optional date filtering)
exports.getAllExports = async (req, res) => {
  try {
    const { title } = req.query;
    let filter = {};
    if (title) {
      filter.title = new RegExp(title, "i"); // Case-insensitive partial match
    }
    const exports = await Export.find(filter);
    res
      .status(200)
      .json({ message: "Exports fetched successfully", exports });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exports", error: error.message });
  }
};

// Get a single export by ID
exports.getExportById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Export.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Export not found" });
    }

    res.status(200).json({ message: "Export fetched successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching export", error: error.message });
  }
};



exports.filterExport = async (req, res) => {
  try {
    const { title, description, category } = req.query; // Extract query params

    // Build a dynamic search filter
    let filter = {};

    if (description) {
      filter.description = description; // Exact match for type
    }
    if (title) {
      filter.title = new RegExp(title, "i"); // Case-insensitive partial match
    }
    if (category) {
      filter.category = new RegExp(category, "i"); // Case-insensitive partial match
    }

    // Query database with filters
    const results = await Export.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Export Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Export Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.searchExport = async (req, res) => {
  try {
    const { title } = req.query; // Get title from request query

    let filter = {};
    if (title) {
      // Case-insensitive partial match for title
      filter.title = new RegExp(title, "i");
    }

    const results = await Export.find(filter);

    res.status(200).json({
      title: "Search Export Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Export Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
