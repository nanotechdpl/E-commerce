const Joi = require('joi');

const uploadFile = (req, res, next) => {
  const schema = Joi.object({
    upload_type: Joi.string().valid('profile', 'document', 'media', 'general').optional(),
    is_public: Joi.boolean().optional(),
    resize: Joi.boolean().optional(),
    width: Joi.number().integer().min(50).max(4000).optional(),
    height: Joi.number().integer().min(50).max(4000).optional(),
    quality: Joi.number().integer().min(10).max(100).optional()
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

const updateMetadata = (req, res, next) => {
  const schema = Joi.object({
    metadata: Joi.object().required()
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
  uploadFile,
  updateMetadata
};
