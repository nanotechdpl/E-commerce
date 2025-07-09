const express = require('express');
const {
  createSocialMediaIcon,
  getAllSocialMediaIcons,
  getSocialMediaIconById,
  updateSocialMediaIcon,
  deleteSocialMediaIcon,
} = require('../controller/social.media.icons.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');


const router = express.Router();

// Create
router.post('/', isAdmin, createSocialMediaIcon);

// Read All
router.get('/', getAllSocialMediaIcons);

// Read One
router.get('/:id', getSocialMediaIconById);

// Update
router.put('/:id', isAdmin, updateSocialMediaIcon);

// Delete
router.delete('/:id', isAdmin, deleteSocialMediaIcon);

module.exports = router;