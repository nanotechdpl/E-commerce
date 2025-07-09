const express = require('express');
const {
    createThreeCard,
    getAllThreeCards,
    getThreeCardById,
    updateThreeCard,
    deleteThreeCard,
} = require('../controller/three.cards.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const router = express.Router();

router.get('/', getAllThreeCards);
router.get('/:id', getThreeCardById);
router.put('/:cardKey', isAdmin, updateThreeCard);
router.delete('/:id', isAdmin, deleteThreeCard);

module.exports = router;