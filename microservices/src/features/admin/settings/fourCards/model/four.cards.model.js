const mongoose = require('mongoose');

const fourCardsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tag: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('FourCards', fourCardsSchema);