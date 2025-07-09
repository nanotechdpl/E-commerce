
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {

  next()
};

module.exports = isAdmin;