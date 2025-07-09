const mongoose = require('mongoose');

const fiveCardsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    photo: {
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
    cardKey: {
        type: String,
        enum: ['card1', 'card2', 'card3', 'card4', 'card5'],
    },
}, { timestamps: true });

module.exports = mongoose.model('FiveCards', fiveCardsSchema);