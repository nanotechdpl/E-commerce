const FourCards = require('../model/four.cards.model');

// Create a new fourCards record with a restriction of max 4 entries
exports.createFourCard = async (req, res) => {
    try {
        const { title, image, tag, description } = req.body;

        // Check the count of existing records
        const existingCount = await FourCards.countDocuments();
        if (existingCount >= 4) {
            return res.status(400).json({
                success: false,
                message: 'Only 4 cards can be present in records. Limit reached.',
            });
        }

        const newCard = await FourCards.create({ title, image, tag, description });
        res.status(201).json({ success: true, data: newCard });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all fourCards records
exports.getAllFourCards = async (req, res) => {
    try {
        const cards = await FourCards.find();
        res.status(200).json({ success: true, data: cards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single fourCards record by ID
exports.getFourCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await FourCards.findById(id);
        if (!card) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }
        res.status(200).json({ success: true, data: card });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a fourCards record
exports.updateFourCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, tag, description } = req.body;

        const updatedCard = await FourCards.findByIdAndUpdate(
            id,
            { title, image, tag, description },
            { new: true }
        );

        if (!updatedCard) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }

        res.status(200).json({ success: true, data: updatedCard });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a fourCards record
exports.deleteFourCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await FourCards.findByIdAndDelete(id);
        if (!deletedCard) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }

        res.status(200).json({ success: true, message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};