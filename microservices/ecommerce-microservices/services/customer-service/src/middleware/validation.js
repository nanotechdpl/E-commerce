const Joi = require('joi');

const registerCustomer = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        first_name: Joi.string().min(2).max(50).required(),
        last_name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().optional(),
        address: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

const loginCustomer = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

const updateCustomer = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().min(2).max(50).optional(),
        last_name: Joi.string().min(2).max(50).optional(),
        phone: Joi.string().optional(),
        address: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

module.exports = {
    registerCustomer,
    loginCustomer,
    updateCustomer
};