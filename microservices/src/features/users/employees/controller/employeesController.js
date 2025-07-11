const EmployeeModel = require("../model/employeesModel");
// const Users = require('../../auth/models/userModel');

const registerEmployee = async (req, res) => {
  try {
    const { title, name, photo, isBestEmployee, links } = req.body;

    if (!title || !name || !photo) {
      return res.status(400).json({
        title: "Employee Message",
        status: 400,
        success: false,
        message:
          "At least title, name, and photo fields are needed to register a new employee.",
      });
    }

    const newEmployee = new EmployeeModel({
      title,
      name,
      photo,
      links,
      // userId,
      isBestEmployee: isBestEmployee || false,
    });

    await newEmployee.save();

    const employees = await EmployeeModel.find().sort("-1");

    res.status(200).json({
      title: "Employee Message",
      status: 200,
      success: true,
      message: "Successfully uploaded employee.",
      data: employees,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      title: "Employee Message",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, photo, isBestEmployee, links } = req.body;

    // Perform the update operation
    const result = await EmployeeModel.findByIdAndUpdate(
      id,
      {
        title,
        name,
        photo,
        isBestEmployee: isBestEmployee || false, // Default to false if not provided
        links,
      },
      { new: true } // Return the updated document and validate
    );

    if (!result) {
      return res.status(404).json({
        title: "Employee Message",
        status: 404,
        success: false,
        message: "Employee not found.",
      });
    }

    res.status(200).json({
      title: "Employee Message",
      status: 200,
      success: true,
      message: "Successfully updated employee.",
      data: result,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      title: "Employee Message",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      EmployeeModel.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ],
      }).limit(limit),
      EmployeeModel.countDocuments({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "Employee fetched successfully",
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

const changeEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await EmployeeModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
        status: 404,
        error: "Employee not found",
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

    const updated = await EmployeeModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(
        { 
          success: false,
          message: "Employee not found" ,
          status: 404,
          error: "Employee not found",
        });
    }

    res.status(200).json({
      success: true,
      message: "Employee status updated successfully",
       data: updated,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Employee status",
      error: error.message,
      status: 500,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find employee by ID
    const employee = await EmployeeModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        title: "Employee Message",
        status: 404,
        successful: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      title: "Employee Message",
      status: 200,
      successful: true,
      message: "Employee details fetched successfully.",
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      title: "Employee Message",
      status: 500,
      successful: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  

  // Find the employee by ID
  const employee = await EmployeeModel.findByIdAndDelete(id);

  if (!employee) {
    return res.status(404).json({
      status: 404,
      message: "Employee not found.",
      success: false,

    });
  }



  res.status(200).json({
    status: 200,
    message: "Employee deleted successfully.",
    success: true,
    employee,
  });
};

const getEmployeeAnalytics = async (req, res) => {
  try {
    // Total number of employees
    const totalEmployees = await EmployeeModel.countDocuments();

    // Count of best employees
    const bestEmployees = await EmployeeModel.countDocuments({
      isBestEmployee: true,
    });

    res.status(200).json({
      status: 200,
      message: "Analytics fetched successfully.",
      analytics: {
        totalEmployees,
        bestEmployees,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getTopEmployees = async (req, res) => {
  // Retrieve top 3 employees sorted by rating (highest first)
  const employees = await EmployeeModel.find()
    .sort({ rating: -1 })
    .limit(3)
    .lean();

  if (employees.length < 3) {
    throw new Error("Not enough employees for leaderboard");
  }

  // Reset isBestEmployee to false for all employees
  await EmployeeModel.updateMany(
    { isBestEmployee: true },
    { $set: { isBestEmployee: false } }
  );

  // Update the best employee's isBestEmployee field to true
  await EmployeeModel.findByIdAndUpdate(employees[0]._id, {
    isBestEmployee: true,
  });

  // Center the top-rated employee for leaderboard display
  const bestEmployee = employees[0];
  const topThree = [employees[1], bestEmployee, employees[2]];

  const topThreeOutput = topThree.map((employee, index) => ({
    ...employee,
    isCenter: index === 1, // Marks the best employee for special styling
  }));

  res.status(200).json({ leaderboard: topThreeOutput });
};

const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Construct a case-insensitive regex search for string fields
    const searchRegex = new RegExp(query, "i");

    const results = await EmployeeModel.find({
      $or: [{ title: searchRegex }, { name: searchRegex }].filter(Boolean), // Remove null conditions
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  registerEmployee,
  getEmployees,
  updateEmployee,
  getEmployeeById,
  changeEmployeeStatus,

  deleteEmployee,
  getEmployeeAnalytics,
  getTopEmployees,
  searchEmployees,
};
