const Joi = require('joi');

const createOrder = (req, res, next) => {
  const schema = Joi.object({
    order_id: Joi.number().integer().required(),
    customer_id: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).optional(),
    return_url: Joi.string().uri().optional(),
    cancel_url: Joi.string().uri().optional()
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

const captureOrder = (req, res, next) => {
  const schema = Joi.object({
    paypal_order_id: Joi.string().required()
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

const createRefund = (req, res, next) => {
  const schema = Joi.object({
    payment_id: Joi.string().required(),
    amount: Joi.number().positive().optional(),
    reason: Joi.string().optional()
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
  captureOrder,
  createRefund
};

