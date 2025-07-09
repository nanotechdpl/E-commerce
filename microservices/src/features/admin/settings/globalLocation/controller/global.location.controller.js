const globalLocationModel = require("../model/global.location.model");

exports.createLocation = async (req, res) => {
  try {
    const { name, address, photo, call, email, links } = req.body;
    if (!name || !address || !photo || !call || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        status: 400,
      error: "Please provide name, address, photo, call, and email",
      });
    }

    const newLocationData = new globalLocationModel({
      name,
      address,
      photo,
      call,
      email,
      links: links || [], 
      status: "active",
    });

    await newLocationData.save();

    
    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: newLocation,
      status: 201,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changeBranchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await globalLocationModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
        status: 404,
        error: "Branch not found",
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

    const updated = await globalLocationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Branch not found" ,
          status: 404,
          error: "Branch not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Branch status updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Branch status",
      error: error.message,
      status: 500,
    });
  }
};

exports.getAllLocations = async (req, res) => {
 try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      globalLocationModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      globalLocationModel.countDocuments({
        $or: [
          { name: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "Branch fetched successfully",
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

exports.getLocationById = async (req, res) => {
  try {
    const location = await globalLocationModel.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {

  try {
    const {id} = req.params;
       const { name, address, photo, call, email, links } = req.body;
       const  result = await globalLocationModel.findOneAndUpdate(
        id,
        { name, address, photo, call, email, links },
        { new: true}
       )
  
    if (!result) {
      return res.status(404).json({ 
        title: "Location Message",
        status: 404,
        success: false,
        message: "Location not found",
        error: "Location not found",
      });
    }
    res.status(200).json({
      title: "Location Message",
      status: 200,
      success: true,
      message: "Location updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message,
      title: "Location Message",
      status: 500,
      success: false,
      message: "Failed to update location",
      error: error.message,
     });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
 
    const deletedLocation = await globalLocationModel.findByIdAndDelete(
     id
    );
    if (!deletedLocation) {
      return res.status(404).json({
        title: "Location Message",
        status: 404,
        success: false,
        message: "Location not found",
        error: "Location not found",
      });
    }
    res.status(200).json({
      title: "Location Message",
      status: 200,
      success: true,
      message: "Location deleted successfully",
      data: deletedLocation,
    });
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchGlobalLocations = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Construct a case-insensitive regex search for string fields
    const searchRegex = new RegExp(query, "i");

    const results = await globalLocationModel.find({
      $or: [{ address: searchRegex }, { name: searchRegex }].filter(Boolean), // Remove null conditions
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
