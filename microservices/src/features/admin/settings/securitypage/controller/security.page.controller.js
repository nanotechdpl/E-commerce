const { securityPageModel } = require("../model/security.page.model");

// Add a new security page
const addSecurityPage = async (req, res) => {
  try {
    const { image, title, tag, description } = req.body;
    const newSecurityPage = new securityPageModel({
      image,
      title,
      tag,
      description,
    });
    await newSecurityPage.save();
    res
      .status(201)
      .json({
        message: "Security page added successfully",
        data: newSecurityPage,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update a security page
const updateSecurityPage = async (req, res) => {
  try {
    const { id, image, title, tag, description } = req.body;
    const updatedSecurityPage = await securityPageModel.findByIdAndUpdate(
      id,
      { image, title, tag, description },
      { new: true }
    );
    if (!updatedSecurityPage) {
      return res.status(404).json({ message: "Security page not found" });
    }
    res
      .status(200)
      .json({
        message: "Security page updated successfully",
        data: updatedSecurityPage,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete a security page
const deleteSecurityPage = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedSecurityPage = await securityPageModel.findByIdAndDelete(id);
    if (!deletedSecurityPage) {
      return res.status(404).json({ message: "Security page not found" });
    }
    res.status(200).json({ message: "Security page deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all security pages
const getSecurityPages = async (req, res) => {
  try {
    const securityPages = await securityPageModel.find();
    res.status(200).json({ data: securityPages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addSecurityPage,
  updateSecurityPage,
  deleteSecurityPage,
  getSecurityPages,
};
