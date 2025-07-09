const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', isAdmin, contactController.updateContact);
router.delete('/:id', isAdmin, contactController.deleteContact);

module.exports = router;