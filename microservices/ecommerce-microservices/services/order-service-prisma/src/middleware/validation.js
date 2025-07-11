const Joi = require('joi');

const createOrder = (req, res, next) => {
    const schema = Joi.object({
        customer_id: Joi.number().integer().required(),
        items: Joi.array().items(
            Joi.object({
                product_id: Joi.number().integer().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).min(1).required(),
        shipping_address: Joi.string().min(10).max(500).required()
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

const updateOrderStatus = (req, res, next) => {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required()
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
    createOrder,
    updateOrderStatus
};