const SupportIcon = require("../model/support.icon.model");

const createSupportIcon = async (req, res) => {
  try {
    console.log("Creating Support icon with data:", req.body);
    const supportIcon = await SupportIcon.create(req.body);
    res.status(201).json({
      success: true,
      message: "Support icon created successfully",
      data: supportIcon,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Support icon",
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

const getAllSupportIcons = async (req, res) => {
  try {
    const supportIcon = await SupportIcon.find();
    res.status(200).json({ success: true, data: supportIcon,
        status: 200,
        message: "Support icons fetched successfully",
     });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Support icons", error: error.message ,
        status: 500,
        success: false,
      });
  }
};

const getSupportIconById = async (req, res) => {
  try {
    const supportIcon = await SupportIcon.findById(req.params.id);
    if (!supportIcon) {
      return res.status(404).json({ message: "Support icon not found" });
    }
    res.status(200).json({ data: supportIcon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Support icon", error: error.message });
  }
};

const updateSupportIcon = async (req, res) => {
  try {
    const supportIcon = await SupportIcon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!supportIcon) {
      return res.status(404).json({ message: "Support icon not found" });
    }
    res
      .status(200)
      .json({
        message: "Support icon updated successfully",
        data: supportIcon,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Support icon", error: error.message });
  }
};

const deleteSupportIcon = async (req, res) => {
  try {
    const supportIcon = await SupportIcon.findByIdAndDelete(req.params.id);
    if (!supportIcon) {
      return res.status(404).json({ message: "Support icon not found" });
    }
    res.status(200).json({ message: "Support icon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Support icon", error: error.message });
  }
};

module.exports = {
  createSupportIcon,
  getAllSupportIcons,
  getSupportIconById,
  updateSupportIcon,
  deleteSupportIcon,
};
