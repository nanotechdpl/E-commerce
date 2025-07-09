const express = require('express');
const {
    createFiveCard,
    getAllFiveCards,
    getFiveCardById,
    updateFiveCard,
    deleteFiveCard,
} = require('../controller/fiveCardsController');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const router = express.Router();

router.get('/', getAllFiveCards);
router.get('/:id', getFiveCardById);
router.put('/:cardKey', isAdmin, updateFiveCard);
router.delete('/:id', isAdmin, deleteFiveCard);

module.exports = router;