const Joi = require('joi');

const setValue = (req, res, next) => {
  const schema = Joi.object({
    key: Joi.string().required().min(1).max(250),
    value: Joi.any().required(),
    ttl: Joi.number().integer().min(1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const setExpiration = (req, res, next) => {
  const schema = Joi.object({
    ttl: Joi.number().integer().min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const getMultipleValues = (req, res, next) => {
  const schema = Joi.object({
    keys: Joi.array().items(Joi.string().min(1).max(250)).min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const setMultipleValues = (req, res, next) => {
  const schema = Joi.object({
    keyValuePairs: Joi.object().pattern(
      Joi.string().min(1).max(250),
      Joi.any()
    ).min(1).required(),
    ttl: Joi.number().integer().min(1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const setHashField = (req, res, next) => {
  const schema = Joi.object({
    key: Joi.string().required().min(1).max(250),
    field: Joi.string().required().min(1).max(250),
    value: Joi.any().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  setValue,
  setExpiration,
  getMultipleValues,
  setMultipleValues,
  setHashField
};