const SocialMediaIcon = require('../model/social.media.icons');

const createSocialMediaIcon = async (req, res) => {
    try {
        const socialMediaIcon = await SocialMediaIcon.create(req.body);
        res.status(201).json({ message: 'Social media icon created successfully', data: socialMediaIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error creating social media icon', error: error.message });
    }
};

const getAllSocialMediaIcons = async (req, res) => {
    try {
        const socialMediaIcons = await SocialMediaIcon.find();
        res.status(200).json({ data: socialMediaIcons });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching social media icons', error: error.message });
    }
};

const getSocialMediaIconById = async (req, res) => {
    try {
        const socialMediaIcon = await SocialMediaIcon.findById(req.params.id);
        if (!socialMediaIcon) {
            return res.status(404).json({ message: 'Social media icon not found' });
        }
        res.status(200).json({ data: socialMediaIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching social media icon', error: error.message });
    }
};

const updateSocialMediaIcon = async (req, res) => {
    try {
        const socialMediaIcon = await SocialMediaIcon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!socialMediaIcon) {
            return res.status(404).json({ message: 'Social media icon not found' });
        }
        res.status(200).json({ message: 'Social media icon updated successfully', data: socialMediaIcon });
    } catch (error) {
        res.status(500).json({ message: 'Error updating social media icon', error: error.message });
    }
};

const deleteSocialMediaIcon = async (req, res) => {
    try {
        const socialMediaIcon = await SocialMediaIcon.findByIdAndDelete(req.params.id);
        if (!socialMediaIcon) {
            return res.status(404).json({ message: 'Social media icon not found' });
        }
        res.status(200).json({ message: 'Social media icon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting social media icon', error: error.message });
    }
};

module.exports = {
    createSocialMediaIcon,
    getAllSocialMediaIcons,
    getSocialMediaIconById,
    updateSocialMediaIcon,
    deleteSocialMediaIcon,
};