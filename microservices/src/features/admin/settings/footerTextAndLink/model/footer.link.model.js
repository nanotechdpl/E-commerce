const mongoose = require('mongoose');

const footerTextAndLinkSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('FooterTextAndLink', footerTextAndLinkSchema);