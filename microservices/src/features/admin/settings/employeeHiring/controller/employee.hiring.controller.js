const employeeHiringModel = require("../model/employee.hiring.model");


const getEmployeeHiringWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      employeeHiringModel.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          {tag: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      employeeHiringModel.countDocuments({
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



const changeEployeeHiringStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await employeeHiringModel.findById(id);
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

    const updated = await employeeHiringModel.findByIdAndUpdate(
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
const addEmployeeHiring = async (req, res) => {
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


    const newEmployeeHiringItem = new employeeHiringModel({ 
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
const updateEmployeeHiring = async (req, res) => {
  try {
    const { hiringKey } = req.params;
    const {  title, photo, tag, description } = req.body;


    const hiringItem = await employeeHiringModel.findOne({ hiringKey });



    const updatedEmployeeHiringItem = await employeeHiringModel.findByIdAndUpdate(
      hiringItem._id,
      { title, photo, tag, description, hiringKey },
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
const deleteEmployeeHiring = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedEmployeeHiringItem = await employeeHiringModel.findByIdAndDelete(id);
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
const getEmployeeHiring = async (req, res) => {
  try {
    let {query ="", limit} = req.query
    const page = parseInt(req.query.page) || 1; 
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [employeeHiringItems, totalData] = await Promise.all([
      employeeHiringModel.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tag: { $regex: query, $options: 'i' } }
        ]
      }).limit(limit),
      employeeHiringModel.countDocuments({
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
  addEmployeeHiring,
  updateEmployeeHiring,
  deleteEmployeeHiring,
  getEmployeeHiring,
  getEmployeeHiringWithPaginationAndSearch,
  changeEployeeHiringStatus
};