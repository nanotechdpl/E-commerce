const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Redis connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Cache service temporarily unavailable',
      error: 'Redis connection failed'
    });
  }

  // Redis timeout errors
  if (err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      success: false,
      message: 'Cache service timeout',
      error: 'Redis operation timed out'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
