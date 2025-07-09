const express = require('express');
const {
    createFourCard,
    getAllFourCards,
    getFourCardById,
    updateFourCard,
    deleteFourCard,
} = require('../controller/four.cards.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const router = express.Router();

router.post('/', isAdmin, createFourCard);
router.get('/', getAllFourCards);
router.get('/:id', getFourCardById);
router.put('/:id', isAdmin, updateFourCard);
router.delete('/:id', isAdmin, deleteFourCard);

module.exports = router;