const PaymentIcon = require('../model/payment.icons.model');

// Create a new payment icon
const createPaymentIcon = async (req, res) => {
    try {
        const paymentIcon = await PaymentIcon.create(req.body);
        res.status(201).json({ success: true, message: 'Payment icon created successfully', data: paymentIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment icon', error: error.message });
    }
};

// Get all payment icons
const getAllPaymentIcons = async (req, res) => {
    try {
        const paymentIcons = await PaymentIcon.find();
        res.status(200).json({ data: paymentIcons });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment icons', error: error.message });
    }
};

// Get a single payment icon by ID
const getPaymentIconById = async (req, res) => {
    try {
        const paymentIcon = await PaymentIcon.findById(req.params.id);
        if (!paymentIcon) {
            return res.status(404).json({ message: 'Payment icon not found' });
        }
        res.status(200).json({ data: paymentIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment icon', error: error.message });
    }
};

// Update a payment icon by ID
const updatePaymentIcon = async (req, res) => {
    try {
        const paymentIcon = await PaymentIcon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!paymentIcon) {
            return res.status(404).json({ message: 'Payment icon not found' });
        }
        res.status(200).json({ message: 'Payment icon updated successfully', data: paymentIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment icon', error: error.message });
    }
};

// Delete a payment icon by ID
const deletePaymentIcon = async (req, res) => {
    try {
        const paymentIcon = await PaymentIcon.findByIdAndDelete(req.params.id);
        if (!paymentIcon) {
            return res.status(404).json({ message: 'Payment icon not found' });
        }
        res.status(200).json({ message: 'Payment icon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment icon', error: error.message });
    }
};

module.exports = {
    createPaymentIcon,
    getAllPaymentIcons,
    getPaymentIconById,
    updatePaymentIcon,
    deletePaymentIcon,
};