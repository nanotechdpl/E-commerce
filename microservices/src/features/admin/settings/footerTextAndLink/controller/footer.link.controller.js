const FooterTextAndLink = require('../model/footer.link.model');

// Create a new footerTextAndLink record
exports.createFooterTextAndLink = async (req, res) => {
    try {
        const { text, link } = req.body;
        const newEntry = await FooterTextAndLink.create({ text, link });
        res.status(201).json({ success: true, data: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all footerTextAndLink records
exports.getFooterTextAndLinks = async (req, res) => {
    try {
        const entries = await FooterTextAndLink.find();
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single footerTextAndLink record by ID
exports.getFooterTextAndLinkById = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await FooterTextAndLink.findById(id);
        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a footerTextAndLink record
exports.updateFooterTextAndLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, link } = req.body;
        const updatedEntry = await FooterTextAndLink.findByIdAndUpdate(
            id,
            { text, link },
            { new: true }
        );
        if (!updatedEntry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, data: updatedEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a footerTextAndLink record
exports.deleteFooterTextAndLink = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await FooterTextAndLink.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};