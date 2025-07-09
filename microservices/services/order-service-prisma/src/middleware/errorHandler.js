const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Prisma specific errors
    if (err.code === 'P2002') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry. This record already exists.'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Record not found.'
        });
    }

    if (err.code === 'P2003') {
        return res.status(400).json({
            success: false,
            message: 'Foreign key constraint failed.'
        });
    }

    // Default error
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

module.exports = errorHandler;