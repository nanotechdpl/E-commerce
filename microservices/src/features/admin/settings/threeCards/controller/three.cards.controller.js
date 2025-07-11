const ThreeCards = require('../model/three.cards.model');


// Get all threeCards records
exports.getAllThreeCards = async (req, res) => {
    try {
        const cards = await ThreeCards.find();
        res.status(200).json({ success: true, data: cards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single threeCards record by ID
exports.getThreeCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await ThreeCards.findById(id);
        if (!card) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }
        res.status(200).json({ success: true, data: card });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a threeCards record
exports.updateThreeCard = async (req, res) => {
    try {
        const { cardKey } = req.params;

  
        const card = await ThreeCards.findOne({ cardKey });
        if (!card) {
            return res.status(404).json({ success: false, message: 'Card not found',
                status: 404,
                message: "Card not found",
             });
        }

        const { title, photo, tag, description } = req.body;

        // Use card._id for update, not cardKey
        const updatedCard = await ThreeCards.findByIdAndUpdate(
           card._id,
            { title, photo, tag, description, cardKey },
            { new: true }
        );
    

        if (!updatedCard) {
            return res.status(404).json({ success: false, message: 'Card not found',
                status: 404,
                message: "Card not found",
             });
        }

        res.status(200).json({ success: true, data: updatedCard,
            status: 200,
            message: "Card updated successfully",
         });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,
            status: 500,
            message: "Error updating card",
         });
    }
};

// Delete a threeCards record
exports.deleteThreeCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await ThreeCards.findByIdAndDelete(id);
        if (!deletedCard) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }

        res.status(200).json({ success: true, message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};