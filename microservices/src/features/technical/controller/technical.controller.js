const Technical = require("../model/technical.model");


const { SERVICE_CATEGORY } = require("../../../utils/constant");

// Create a new technical
exports.getAllTechnicalsWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [technicals, totalData] = await Promise.all([
      Technical.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Technical.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          technicals, 
         totalData,
         success: true,
         status: 200,
         message: "technicals fetched successfully",
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
exports.getAllTechnicalsWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [technicals, totalData] = await Promise.all([
      Technical.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Technical.countDocuments({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          technicals, 
         totalData,
         success: true,
         status: 200,
         message: "technicals fetched successfully",
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

exports.changeTechnicalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTechnical = await Technical.findById(id);
    if (!existingTechnical) {
      return res.status(404).json({
        success: false,
        message: "Technical not found",
        status: 404,
        error: "Technical not found",
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

    const updatedTechnical = await Technical.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTechnical) {
      return res.status(404).json(
        { 
          success: false,
          message: "Technical not found" ,
          status: 404,
          error: "Technical not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Technical status updated successfully",
       updatedTechnical,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Technical status",
      error: error.message,
      status: 500,
    });
  }
};

exports.createTechnical = async (req, res) => {
  try {
    const { title, description, category, photo, tag } = req.body;

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Technical Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description and category fields are needed to upload technical service.",
      });
      return;
    }

    const technical = new Technical({
      title,
      description,
      photo,
      category,
      tag
    });
    const savedTechnical = await technical.save();

    res.status(201).json({
      success: true,
      message: "Technical created successfully",
      data: savedTechnical,
      status: 201,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating technical", error: error.message });
  }
};


// Update a technical by ID
exports.updateTechnical = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, photo, category, tag } = req.body;

    const updatedTechnical = await Technical.findByIdAndUpdate(
      id,
      { title, description, photo, category, tag },
      { new: true }
    );

    if (!updatedTechnical) {
      return res.status(404).json({ message: "Technical not found" });
    }

    res.status(200).json({
      success: true,
      message: "Technical updated successfully",
      data: updatedTechnical,
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating technical", error: error.message });
  }
};

// Delete a technical by ID
exports.deleteTechnical = async (req, res) => {
  try {
    const { id } = req.params;

    const technical = await Technical.findByIdAndDelete(id);

    if (!technical) {
      return res.status(404).json({ message: "Technical not found" });
    }

    res.status(200).json({success:true, message: "Technical deleted successfully", technical });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting technical", error: error.message });
  }
};


// Get all technicals (with optional date filtering)
exports.getAllTechnicals = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = {};
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const technicals = await Technical.find(query);
    res.status(200).json({
      message: "Technicals fetched successfully",
      technicals,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching technicals", error: error.message });
  }
};

// Get a single technical by ID
exports.getTechnicalById = async (req, res) => {
  try {
    const { id } = req.params;
    const technical = await Technical.findById(id);

    if (!technical) {
      return res.status(404).json({ message: "Technical not found" });
    }

    res
      .status(200)
      .json({ message: "Technical fetched successfully", data: technical });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching technical", error: error.message });
  }
};




exports.filterTechnical = async (req, res) => {
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
    const results = await Technical.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Techinal Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Techinal Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.searchTechnical = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Construct a case-insensitive regex search for string fields
    const searchRegex = new RegExp(query, "i");

    // Convert date queries properly
    const dateQuery = !isNaN(Date.parse(query)) ? new Date(query) : null;

    const results = await Technical.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { image: searchRegex },
        dateQuery !== null ? { created_at: { $gte: dateQuery } } : null,
      ].filter(Boolean), // Remove null conditions
    });

    // res.json(results);
    res.status(200).json({
      title: "Search Techinal Successfully",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error });
    res.status(500).json({
      title: "Techinal Search Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getCategory = async (req, res) => {
  try {
    // Find all unique categories from the Technical collection
    const categories = await Technical.distinct("category");
    res.status(200).json({
      title: "Get Tech Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Tech Stacks",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};
