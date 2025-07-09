const Business = require("../model/business.model");



// Create a new Business
exports.getAllBusinesssWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      Business.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Business.countDocuments({
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
         message: "Business fetched successfully",
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
exports.getAllBusinesssWithSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      Business.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      Business.countDocuments({
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
         message: "Business fetched successfully",
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
    const categories = await Business.distinct("category");
    res.status(200).json({
      title: "Get Business Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Business",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

exports.changeBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await Business.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
        status: 404,
        error: "Business not found",
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

    const updated = await Business.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Business not found" ,
          status: 404,
          error: "Business not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Business status updated successfully",
      updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Business status",
      error: error.message,
      status: 500,
    });
  }
};

exports.createBusiness = async (req, res) => {
  try {
    const { title, description, category, photo, tag } = req.body;

    if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Business Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description and category fields are needed to upload technical service.",
      });
      return;
    }

    const data = new Business({
      title,
      description,
      photo,
      category,
      tag
    });
    const savedBusiness = await data.save();

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: savedBusiness,
      status: 201,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Business", error: error.message });
  }
};


// Update a Business by ID
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, photo, category, tag } = req.body;

    const updated = await Business.findByIdAndUpdate(
      id,
      { title, description, photo, category, tag },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: updated,
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Business", error: error.message });
  }
};

// Delete a Business by ID
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Business.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({success:true, message: "Business deleted successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Business", error: error.message });
  }
};






