const express = require('express');
const {
    createFooterTextAndLink,
    getFooterTextAndLinks,
    getFooterTextAndLinkById,
    updateFooterTextAndLink,
    deleteFooterTextAndLink,
} = require('../controller/footer.link.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');



const router = express.Router();

router.post('/', isAdmin, createFooterTextAndLink);
router.get('/', getFooterTextAndLinks);
router.get('/:id', getFooterTextAndLinkById);
router.put('/:id', isAdmin, updateFooterTextAndLink);
router.delete('/:id', isAdmin, deleteFooterTextAndLink);

module.exports = router;