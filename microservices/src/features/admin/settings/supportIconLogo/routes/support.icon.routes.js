const express = require('express');
const { createSupportIcon, getAllSupportIcons, getSupportIconById, updateSupportIcon, deleteSupportIcon } = require('../controller/support.icon.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');



const router = express.Router();

// Create
router.post('/', isAdmin, createSupportIcon);

// Read All
router.get('/', getAllSupportIcons);

// Read One
router.get('/:id', getSupportIconById);

// Update
router.put('/:id', isAdmin, updateSupportIcon);

// Delete
router.delete('/:id', isAdmin, deleteSupportIcon);

module.exports = router;