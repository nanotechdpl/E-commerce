const realEstateModel = require("../model/real.estate.model");


const AddRealEstate = async (req, res) => {
  try {
    const {
      photo,
      propertyStatus,
      type,
      address,
      sizeOrSquareFeet,
      priceOrBudget,
      beds,
      bathRoom,
      kitchen,
      features,
      description
    } = req.body;
 
    if (!photo || !propertyStatus || !type || !address || !priceOrBudget || !description) {
      res.status(400).json({
        title: "Real Estate Message",
        status: 400,
        successful: false,
        message:
          "At least photo, propertyStatus, type, address, and priceOrBudget fields are needed to upload real estate.",
      });
      return;
    }

    const realEstateData = new realEstateModel({
      photo,
      propertyStatus,
      type,
      address,
      sizeOrSquareFeet,
      priceOrBudget,
      beds,
      bathRoom,
      kitchen,
      features,
      description
    });
    const data = await realEstateData.save();

    res.status(201).json({
      title: "Real Estate Message",
      status: 201,
      success: true,
      message: "Real Estate Create Successful.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      title: "Real Estate Message",
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
    return;
  }
};

const getRealEstate = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      realEstateModel
        .find({
          $or: [
            { propertyStatus: { $regex: query, $options: "i" } },
            { type: { $regex: query, $options: "i" } },
            { priceOrBudget: { $regex: query, $options: "i" } },
          ],
        })
        .limit(limit),
      realEstateModel.countDocuments({
        $or: [
          { propertyStatus: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          { priceOrBudget: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "real estage fetched successfully",
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

const getRealEstateType = async (req, res) => {
  try {
    const realEstateTypes = await realEstateModel.distinct("type");

    res.status(200).json({
      title: "Get Real Estate Types",
      status: 200,
      success: true,
      message: "Successfully fetched real estate types.",
      data: realEstateTypes,
    });

  } catch (error) {
    res.status(500).json({
      title: "Get Real Estate Types",
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }

}


const deleteRealEstate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Real estate ID is required to delete.",
      });
    }

    // Find and delete the real estate entry
    const deletedRealEstate = await realEstateModel.findByIdAndDelete(id);

    // Check if the real estate was successfully deleted
    if (!deletedRealEstate) {
      return res.status(404).json({
        status: 404,
        message: "Real estate not found.",
        success: false,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Real estate deleted successfully.",
      success: true,
      data: deletedRealEstate,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};

const updateRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      photo,
      propertyStatus,
      type,
      address,
      sizeOrSquareFeet,
      priceOrBudget,
      beds,
      bathRoom,
      kitchen,
      features,
      description
    } = req.body;

    const updatedData = await realEstateModel.findByIdAndUpdate(
      id,
      {
        photo,
        propertyStatus,
        type,
        address,
        sizeOrSquareFeet,
        priceOrBudget,
        beds,
        bathRoom,
        kitchen,
        features,
        description
      },
      {
        new: true,
      }
    );

    if (!updatedData) {
      return res.status(404).json({
        title: "Update Real Estate Message",
        status: 404,
        success: false,
        message: "Real estate not found.",
      });
    }

    res.status(200).json({
      title: "Update Real Estate Message",
      status: 200,
      success: true,
      message: "Successfully updated real estate.",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      title: "Update Real Estate Message",
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const updatedVisibleRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;

    const existing = await realEstateModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "real estate not found",
        status: 404,
        error: "real estate not found",
      });
    }
    // Validate status value

    if (!["active", "inactive"].includes(visible
    )) {
      return res.status(400).json({
        success: false,
        message: "Invalid visible value. Allowed values are 'active' or 'inactive'.",
        status: 400,
        error: "Invalid status value",
      });
    }

    const updated = await realEstateModel.findByIdAndUpdate(
      id,
      { visible },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Real Estate not found" ,
          status: 404,
          error: "Real Estate not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Real Estate visible updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating real estate visible",
      error: error.message,
      status: 500,
    });
  }
};


const searchRealEstate = async (req, res) => {
  try {
    const { type, title, tag, minPrice, maxPrice } = req.query; // Extract query params

    // Build a dynamic search filter
    let filter = {};

    if (type) {
      filter.type = type; // Exact match for type
    }
    if (title) {
      filter.title = new RegExp(title, "i"); // Case-insensitive partial match
    }
    if (tag) {
      filter.tag = new RegExp(tag, "i"); // Case-insensitive partial match
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // Greater than or equal
      if (maxPrice) filter.price.$lte = Number(maxPrice); // Less than or equal
    }

    // Query database with filters
    const results = await realEstateModel.find(filter);

    // res.json(results);
    res.status(200).json({
      title: "Search Real Estate",
      status: 200,
      successful: true,
      message: "Search results found",
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      title: "Search Real Estate",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const quickSearchRealEstate = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Received query:", query);

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");
    console.log("searchRegex:", searchRegex);

    const results = await realEstateModel.find({
      $or: [
        { title: searchRegex },
        { tag: searchRegex },
        { type: searchRegex },
        { project_details: searchRegex },
        { price: { $regex: searchRegex } }, // Try direct regex if price is string
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Quick search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getRealEstateById = async (req, res) => {
  try {
    const { id } = req.params;
    const realEstate = await realEstateModel.findById(id);
    if (!realEstate) {
      return res.status(404).json({
        title: "Get Real Estate Message",
        status: 404,
        successful: false,
        message: "Real estate not found.",
      });
    }
    res.status(200).json({
      title: "Get Real Estate Message",
      status: 200,
      successful: true,
      message: "Successfully fetched real estate.",
      realEstate,
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Real Estate Message",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



const getRealEstateTypes = async (req, res) => {
  try {
    // Get the types from your real estate model
    const REAL_ESTATE_TYPES = [
      "House",
      "Land",
      "Store",
      "Office Space",
      "Hotel",
      "Industry",
      "Investment",
      "Gastronomy",
      "Auction Property",
      "Other",
    ];

    res.status(200).json({
      title: "Get Real Estate Types",
      status: 200,
      successful: true,
      message: "Successfully fetched real estate types.",
      types: REAL_ESTATE_TYPES,
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Real Estate Types",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  AddRealEstate,
  getRealEstateType,
  getRealEstate,
  searchRealEstate,
  deleteRealEstate,
  getRealEstateById,
  updateRealEstate,
  quickSearchRealEstate,
  getRealEstateTypes,
  updatedVisibleRealEstate
};
