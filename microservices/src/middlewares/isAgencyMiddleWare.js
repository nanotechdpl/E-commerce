const jwt = require('jsonwebtoken');

const isAuthenticateAgency = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token-Agency:', token)

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

module.exports = isAuthenticateAgency;