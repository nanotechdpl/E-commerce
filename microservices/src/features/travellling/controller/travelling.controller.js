const Travelling = require("../model/travelling.model");



exports.getAllTravellingsWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      Travelling.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Travelling.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data, 
         totalData,
         success: true,
         status: 200,
         message: "Travelling fetched successfully",
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
exports.getAllTravellingsWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      Travelling.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Travelling.countDocuments({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json(
      {
          data, 
         totalData,
         success: true,
         status: 200,
         message: "Travelling fetched successfully",
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
    const categories = await Travelling.distinct("category");
    res.status(200).json({
      title: "Get Travelling Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Travelling",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};


exports.changeTravellingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await Travelling.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Travelling not found",
        status: 404,
        error: "Travelling not found",
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

    const updated= await Travelling.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Travelling not found" ,
          status: 404,
          error: "Travelling not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Travelling status updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Travelling status",
      error: error.message,
      status: 500,
    });
  }
};

// Create a new travelling
exports.createTravelling = async (req, res) => {
  try {
    const { title, description,category , places ,photo} = req.body;

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Travelling Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description, photo and category fields are needed to upload travelling.",
      });
      return;
    }
  

    const travelling = new Travelling({
      title,
      description,
      category,
      photo,
      places
    });
    const savedTravelling = await travelling.save();

    res
      .status(201)
      .json({
        message: "Travelling created successfully",
        data: savedTravelling,
      success: true,
      status: 201,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating travelling", error: error.message,
        success: false,
        status: 500,
       });
  }
};

// Update a travelling by ID
exports.updateTravelling = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description,category , places ,photo} = req.body;

 

    const updatedTravelling = await Travelling.findByIdAndUpdate(
      id,
      { title, description,category , places ,photo},
      { new: true }
    );

    if (!updatedTravelling) {
      return res.status(404).json({ message: "Travelling not found",
        success: false,
        status: 404,
        error: "Travelling not found",
       });
    }

    res
      .status(200)
      .json({
        message: "Travelling updated successfully",
        data: updatedTravelling,
        success: true,
        status: 200,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating travelling", error: error.message ,
        success: false,
        status: 500,
        error: error.message,
      });
  }
};

// Delete a travelling by ID
exports.deleteTravelling = async (req, res) => {
  try {
    const { id } = req.params;

    const travelling = await Travelling.findByIdAndDelete(id);

    if (!travelling) {
      return res.status(404).json({ message: "Travelling not found",
        success: false,
        status: 404,
        error: "Travelling not found",
       });
    }

    res.status(200).json({ message: "Travelling deleted successfully" ,
      success: true,
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting travelling", error: error.message,
        success: false,
        status: 500,
        error: error.message,
       });
  }
};

// Get all travellings (with optional date filtering)
exports.getAllTravellings = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = {};
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const travellings = await Travelling.find(query);
    res
      .status(200)
      .json({
        message: "Travellings fetched successfully",
        travellings,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching travellings", error: error.message });
  }
};

// Get a single travelling by ID
exports.getTravellingById = async (req, res) => {
  try {
    const { id } = req.params;
    const travelling = await Travelling.findById(id);

    if (!travelling) {
      return res.status(404).json({ message: "Travelling not found" });
    }

    res
      .status(200)
      .json({ message: "Travelling fetched successfully", data: travelling });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching travelling", error: error.message });
  }
};





exports.filterTravelling = async (req, res) => {
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
    const results = await Travelling.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Travelling",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Travelling Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.searchTravelling = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Construct a case-insensitive regex search for string fields
    const searchRegex = new RegExp(query, "i");

    // Convert date queries properly
    const dateQuery = !isNaN(Date.parse(query)) ? new Date(query) : null;

    const results = await Travelling.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { continent: searchRegex },
        { image: searchRegex },
        dateQuery !== null ? { created_at: { $gte: dateQuery } } : null,
      ].filter(Boolean), // Remove null conditions
    });

    // res.json(results);
    res.status(200).json({
      title: "Search Travelling",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error });
    res.status(500).json({
      title: "Travelling Error",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
