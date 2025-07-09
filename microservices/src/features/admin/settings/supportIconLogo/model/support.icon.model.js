const mongoose = require('mongoose');

const SupportIconLogo = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    isMap: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SupportIconSchema = mongoose.model('support_icon', SupportIconLogo);

module.exports = SupportIconSchema;