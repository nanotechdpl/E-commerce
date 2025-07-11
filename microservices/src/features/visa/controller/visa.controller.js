const Visa = require("../model/visa.model");

// Create a new visa
exports.createVisa = async (req, res) => {
  try {
    const { title, description, category, photo } = req.body;

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Visa Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description, photo and category fields are needed to upload visa service.",
      });
      return;
    }

    const visa = new Visa({
      title,
      description,
      category,
      photo,
    });
    const savedVisa = await visa.save();

    res.status(201).json({
      success: true,
      message: "Visa created successfully",
      data: savedVisa,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating visa", error: error.message });
  }
};

// Update a visa by ID
exports.updateVisa = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, continent, image } = req.body;

    const updatedVisa = await Visa.findByIdAndUpdate(
      id,
      { title, description, continent, image },
      { new: true }
    );

    if (!updatedVisa) {
      return res.status(404).json({ message: "Visa not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Visa updated successfully",
        data: updatedVisa,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating visa", error: error.message });
  }
};

// Delete a visa by ID
exports.deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    const visa = await Visa.findByIdAndDelete(id);

    if (!visa) {
      return res.status(404).json({ message: "Visa not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Visa deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting visa", error: error.message });
  }
};

// Get all visas with pagination and search
exports.getAllVisasWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [visas, totalData] = await Promise.all([
      Visa.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Visa.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          visas, 
         totalData,
         success: true,
         status: 200,
         message: "Visa fetched successfully",
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
exports.getAllVisasWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [visas, totalData] = await Promise.all([
      Visa.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Visa.countDocuments({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data:visas, 
         totalData,
         success: true,
         status: 200,
         message: "Visa fetched successfully",
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
    // Find all unique categories from  collection
    const categories = await Visa.distinct("category");
    res.status(200).json({
      title: "Get Visa Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Visa",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};


exports.changeVisaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingVisa = await Visa.findById(id);
    if (!existingVisa) {
      return res.status(404).json({
        success: false,
        message: "Visa not found",
        status: 404,
        error: "Visa not found",
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

    const updatedVisa = await Visa.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedVisa) {
      return res.status(404).json(
        { 
          success: false,
          message: "Visa not found" ,
          status: 404,
          error: "Visa not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Visa status updated successfully",
       updatedVisa,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating visa status",
      error: error.message,
      status: 500,
    });
  }
};

// Get all visas (with optional date filtering)
exports.getAllVisas = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = {};
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const visas = await Visa.find(query);

    res.status(200).json({
      success: true,
      message: "Visas fetched successfully",
      visas,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching visas", error: error.message });
  }
};

// Get a single visa by ID
exports.getVisaById = async (req, res) => {
  try {
    const { id } = req.params;
    const visa = await Visa.findById(id);

    if (!visa) {
      return res.status(404).json({ message: "Visa not found" });
    }

    res.status(200).json({ message: "Visa fetched successfully", data: visa });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching visa", error: error.message });
  }
};

exports.searchVisa = async (req, res) => {
  try {
    const { title, description, continent } = req.query; // Extract query params

    // Build a dynamic search filter
    let filter = {};

    if (description) {
      filter.description = description; // Exact match for type
    }
    if (title) {
      filter.title = new RegExp(title, "i"); // Case-insensitive partial match
    }
    if (continent) {
      filter.continent = new RegExp(continent, "i"); // Case-insensitive partial match
    }

    // Query database with filters
    const results = await Visa.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Visa",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Visa Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.quickSearchVisa = async (req, res) => {
  try {
    const { title } = req.query; // Get title from request query

    let filter = {};
    if (title) {
      // Case-insensitive partial match for title
      filter.title = new RegExp(title, "i");
    }
    const results = await Visa.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Visa Success",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Quick search error:", error);
    // res.status(500).json({ message: "Server error", error: error.message });
    res.status(500).json({
      title: "Visa Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
