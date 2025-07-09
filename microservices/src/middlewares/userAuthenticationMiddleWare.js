const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model


const isUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      title: "Authentication Error",
      status: 401,
      successful: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      title: "Authentication Error",
      status: 400,
      successful: false,
      message: "Invalid token.",
    });
  }
};

// Middleware to check order request permissions
const isUserForRequestOrder = async (req, res, next) => {

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      title: "Authentication Error",
      status: 401,
      successful: false,
      message: "User is not authenticated.",
    });
  }

  try {
    // Fetch user details from the database
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        title: "Authentication Error",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }

    // Check if user has a currency field
    if (!user.currency) {
      return res.status(400).json({
        title: "Authentication Error",
        status: 400,
        successful: false,
        message: "User does not have a currency field.",
      });
    }

    next(); // ✅ Proceed to createOrder
  } catch (error) {
    console.error("Error in isUserForRequestOrder:", error);
    return res.status(500).json({
      title: "Server Error",
      status: 500,
      successful: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { isUser, isUserForRequestOrder};
