const employeeHiringInMenuService = require("../model/hiring.model");


const getHiringWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      employeeHiringInMenuService.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      employeeHiringInMenuService.countDocuments({
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
         message: "Employee Hiring fetched successfully",
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
const getHiringWitSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      employeeHiringInMenuService.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      employeeHiringInMenuService.countDocuments({
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
         message: "Employee Hiring fetched successfully",
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

const getCategory = async (req, res) => {
  try {
    // Find all unique categories from the Technical collection
    const categories = await employeeHiringInMenuService.distinct("category");
    res.status(200).json({
      title: "Get Employee hiring Categories",
      status: 200,
      successful: true,
      message: "Categories fetched successfully.",
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      title: "Get Employee hiring Categories",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};



const changeHiringStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await employeeHiringInMenuService.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Eployee Hiring not found",
        status: 404,
        error: "Employee Hiring not found",
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

    const updated = await employeeHiringInMenuService.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Employee Hiring not found" ,
          status: 404,
          error: "Employee not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Employee Hiring status updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Employee Hiring status",
      error: error.message,
      status: 500,
    });
  }
};



// Add a new Employee Hiring item
const addHiring = async (req, res) => {
  try {
    const { title, description, category, photo, tag } = req.body;


     if (!title || !description || !category || !photo) {
      res.status(400).json({
        title: "Technical Error Message",
        status: 400,
        successful: false,
        message:
          "Atleast title, description and category fields are needed to upload Employee Hiring service.",
      });
      return;
    }


    const newEmployeeHiringItem = new employeeHiringInMenuService({ 
      title, description, category, photo, tag
     });

   const data = await newEmployeeHiringItem.save();
    res.status(201).json({
       message: "Employee Hiring item added successfully",
        data,
      status: 201,
      success: true,

       });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message,
      status: 500,
      success: false,
     });
  }
};

// Update an Employee Hiring item
const updateHiring = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, photo, tag } = req.body;

    const updatedEmployeeHiringItem = await employeeHiringInMenuService.findByIdAndUpdate(
      id,
      { title, description, category, photo, tag },
      { new: true }
    );
    if (!updatedEmployeeHiringItem) {
      return res.status(404).json({ message: "Employee Hiring item not found",
        status: 404,
        success: false,
        error: "Employee Hiring item not found",
       });
    }
    res.status(200).json({ message: "Employee Hiring item updated successfully", data: updatedEmployeeHiringItem,
      status: 200,
      success: true,
      
     });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message,
      status: 500,
      success: false,
      error: "Internal server error",
     });
  }
};

// Delete an Employee Hiring item
const deleteeHiring = async (req, res) => {
  try {
    const { id } = req.params; // <-- Fix: get id from req.params, not req.body
    const deletedEmployeeHiringItem = await employeeHiringInMenuService.findByIdAndDelete(id);
    if (!deletedEmployeeHiringItem) {
      return res.status(404).json({ message: "Employee Hiring item not found",
        status: 404,
        success: false,
        error: "Employee Hiring item not found",
       });
    }
    res.status(200).json({ message: "Employee Hiring item deleted successfully" ,
      status: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message,
      status: 500,
      success: false,
      error: "Internal server error"
     });
  }
};





// Get all Employee Hiring items
const getHiring = async (req, res) => {
  try {
    let {query ="", limit} = req.query
    const page = parseInt(req.query.page) || 1; 
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [employeeHiringItems, totalData] = await Promise.all([
      employeeHiringInMenuService.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tag: { $regex: query, $options: 'i' } }
        ]
      }).limit(limit),
      employeeHiringInMenuService.countDocuments({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tag: { $regex: query, $options: 'i' } }
        ]
      })  
    ])
    return res.status(200).json({ data: employeeHiringItems, totalData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getHiringWithPaginationAndSearch,
  changeHiringStatus,
  addHiring,
  updateHiring,
  deleteeHiring,
  getHiringWitSearch,
  getCategory,
  getHiring
};