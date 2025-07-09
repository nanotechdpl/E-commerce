const mongoose = require('mongoose');

const socialMediaIconSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SocialMediaIcon = mongoose.model('SocialMediaIcon', socialMediaIconSchema);

module.exports = SocialMediaIcon;