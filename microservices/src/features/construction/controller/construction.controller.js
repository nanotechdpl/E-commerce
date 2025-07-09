const Construction = require("../model/construction.model");
// const ConstructionBanner = require("../model/construction.banner.model");
const { getFileUrl } = require("../../../middlewares/upload");

// Create a new construction
exports.createConstruction = async (req, res) => {
  try {
    const { title, description, category, tag, photo } = req.body;

    console.log("req.body:", req.body);

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Construction Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description, photo and category fields are needed to upload construction service.",
      });
      return;
    }

    const construction = new Construction({
      title,
      description,
      category,
      photo,
      tag,
    });
    const savedConstruction = await construction.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: "Construction created successfully",
      data: savedConstruction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating construction", error: error.message });
  }
};

// Update a construction by ID
exports.updateConstruction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, photo, category, tag } = req.body;
    console.log("req.body:", req.body);

    const updatedConstruction = await Construction.findByIdAndUpdate(
      id,
      { title, description, photo, category, tag },
      { new: true }
    );

    if (!updatedConstruction) {
      return res.status(404).json({ message: "Construction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Construction updated successfully",
      updatedConstruction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating construction", error: error.message });
  }
};

// Delete a construction by ID
exports.deleteConstruction = async (req, res) => {
  try {
    const { id } = req.params;

    const construction = await Construction.findByIdAndDelete(id);

    if (!construction) {
      return res.status(404).json({ message: "Construction not found" });
    }

    res.status(200).json({ success: true, message: "Construction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting construction", error: error.message });
  }
};

// Get all constructions with pagination
exports.getContructionsWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [construction, totalData] = await Promise.all([
      Construction.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Construction.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data: construction, 
         totalData,
         success: true,
         status: 200,
         message: "Construction fetched successfully",
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
exports.getContructionsWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [construction, totalData] = await Promise.all([
      Construction.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Construction.countDocuments({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
        data: construction, 
         totalData,
         success: true,
         status: 200,
         message: "Construction fetched successfully",
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
    const categories = await Construction.distinct("category");
    res.status(200).json({
      title: "Get Construction Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Construction",
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};


//status: "active" or "inactive"
exports.changeConstructionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingContruction = await Construction.findById(id);
    if (!existingContruction) {
      return res.status(404).json({
        success: false,
        message: "Construction not found",
        status: 404,
        error: "Construction not found",
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

    const updatedConstruction = await Construction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedConstruction) {
      return res.status(404).json(
        { 
          success: false,
          message: "Construction not found" ,
          status: 404,
          error: "Construction not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "status updated successfully",
       data: updatedConstruction,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Construction status",
      error: error.message,
      status: 500,
    });
  }
};







// Get all constructions (with optional date filtering)
exports.getAllConstructions = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = {};
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const constructions = await Construction.find(query);
    // const constructionBanner = await ConstructionBanner.find();
    res.status(200).json({
      success: true,
      message: "Constructions fetched successfully",
      constructions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching constructions", error: error.message });
  }
};

// Get a single construction by ID
exports.getConstructionById = async (req, res) => {
  try {
    const { id } = req.params;
    const construction = await Construction.findById(id);

    if (!construction) {
      return res.status(404).json({ message: "Construction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Construction fetched successfully",
      data: construction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching construction", error: error.message });
  }
};



exports.filterConstruction = async (req, res) => {
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
    const results = await Construction.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Construction Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Construction Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.searchConstruction = async (req, res) => {
  try {
 const { title } = req.query; // Get title from request query

    let filter = {};
    if (title) {
      // Case-insensitive partial match for title
      filter.title = new RegExp(title, "i");
    }

    

    const results = await Construction.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Construction Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error });
    res.status(500).json({
      title: "Construction Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
