const mongoose = require('mongoose');

const ThreeCardsSchema = new mongoose.Schema({
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
        enum: ['card1', 'card2', 'card3'],
    },
}, { timestamps: true });

module.exports = mongoose.model('ThreeCards', ThreeCardsSchema);