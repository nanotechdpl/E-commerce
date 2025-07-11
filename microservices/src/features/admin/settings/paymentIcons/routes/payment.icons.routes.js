// src/features/admin/paymentIcons/paymentIcons.routes.js
const express = require('express');
const {
    createPaymentIcon,
    getAllPaymentIcons,
    getPaymentIconById,
    updatePaymentIcon,
    deletePaymentIcon,
} = require('../controller/payment.icons.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const router = express.Router();

// Create a payment icon
router.post('/', isAdmin, createPaymentIcon);

// Read all payment icons
router.get('/', getAllPaymentIcons);

// Read a specific payment icon by ID
router.get('/:id', getPaymentIconById);

// Update a payment icon by ID
router.put('/:id', isAdmin, updatePaymentIcon);

// Delete a payment icon by ID
router.delete('/:id', isAdmin, deletePaymentIcon);

module.exports = router;