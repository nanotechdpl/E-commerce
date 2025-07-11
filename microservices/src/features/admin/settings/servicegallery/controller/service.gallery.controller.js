const { serviceGalleryModel } = require("../model/service.gallery.model");

// Add a new service gallery item
const addServiceGallery = async (req, res) => {
    try {
        const { media, title, category, media_type } = req.body;
        const newGalleryItem = new serviceGalleryModel({ media, title, category, media_type });
        await newGalleryItem.save();
        res.status(201).json({ message: "Service gallery item added successfully", data: newGalleryItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update a service gallery item
const updateServiceGallery = async (req, res) => {
    try {
        const { id, media, title, category, media_type } = req.body;
        const updatedGalleryItem = await serviceGalleryModel.findByIdAndUpdate(
            id,
            { media, title, category, media_type },
            { new: true }
        );
        if (!updatedGalleryItem) {
            return res.status(404).json({ message: "Service gallery item not found" });
        }
        res.status(200).json({ message: "Service gallery item updated successfully", data: updatedGalleryItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a service gallery item
const deleteServiceGallery = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedGalleryItem = await serviceGalleryModel.findByIdAndDelete(id);
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Service gallery item not found" });
        }
        res.status(200).json({ message: "Service gallery item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all service gallery items
const getServiceGallery = async (req, res) => {
    try {
        let {limit} = req.query
        limit = parseInt(limit)
        const [galleryItems, totalData] = await Promise.all([
            serviceGalleryModel.find().limit(limit),
            serviceGalleryModel.countDocuments()
        ]);
        return res.status(200).json({ data: galleryItems, totalData});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const searchServiceGallery = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from request

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Construct a case-insensitive regex search for string fields
        const searchRegex = new RegExp(query, "i");

        const results = await serviceGalleryModel.find({
            $or: [
                { title: searchRegex },
                { category: searchRegex },
                { media_type: searchRegex },
            ].filter(Boolean), // Remove null conditions
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { addServiceGallery, updateServiceGallery, deleteServiceGallery,
    getServiceGallery,searchServiceGallery };