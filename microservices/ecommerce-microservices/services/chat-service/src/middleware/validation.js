const Joi = require('joi');

const messageSchema = Joi.object({
  room_id: Joi.string().required(),
  sender_id: Joi.number().integer().required(),
  sender_name: Joi.string().min(1).max(100).required(),
  recipient_id: Joi.number().integer().optional(),
  message: Joi.string().min(1).max(1000).required(),
  message_type: Joi.string().valid('text', 'image', 'file', 'system').default('text'),
  file_url: Joi.string().uri().optional()
});

const roomSchema = Joi.object({
  room_id: Joi.string().required(),
  room_name: Joi.string().min(1).max(100).optional(),
  room_type: Joi.string().valid('private', 'group').default('private'),
  participants: Joi.array().items(
    Joi.object({
      user_id: Joi.number().integer().required(),
      user_name: Joi.string().min(1).max(100).required(),
      role: Joi.string().valid('admin', 'member').default('member')
    })
  ).min(1).required()
});

const validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    });
  }
  next();
};

const validateRoom = (req, res, next) => {
  const { error } = roomSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateMessage,
  validateRoom
};