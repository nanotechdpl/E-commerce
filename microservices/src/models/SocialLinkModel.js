const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
    platform: { type: String },
    link: { type: String } 
});

module.exports = SocialLinkSchema; 
