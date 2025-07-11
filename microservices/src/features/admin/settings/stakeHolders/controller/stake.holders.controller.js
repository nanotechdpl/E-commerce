const StakeHoldersModel = require("../model/stake.holders.model");

// Add a new StakeHolder
const addStakeHolder = async (req, res) => {
  try {
    const { image, category } = req.body;
    const newStakeHolder = new StakeHoldersModel({ image, category });
    await newStakeHolder.save();
    res.status(201).json({ message: "StakeHolder added successfully", data: newStakeHolder });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update a StakeHolder
const updateStakeHolder = async (req, res) => {
  try {
    const { id, image, category } = req.body;
    const updatedStakeHolder = await StakeHoldersModel.findByIdAndUpdate(
      id,
      { image, category },
      { new: true }
    );
    if (!updatedStakeHolder) {
      return res.status(404).json({ message: "StakeHolder not found" });
    }
    res.status(200).json({ message: "StakeHolder updated successfully", data: updatedStakeHolder });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a StakeHolder
const deleteStakeHolder = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedStakeHolder = await StakeHoldersModel.findByIdAndDelete(id);
    if (!deletedStakeHolder) {
      return res.status(404).json({ message: "StakeHolder not found" });
    }
    res.status(200).json({ message: "StakeHolder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all StakeHolders
const getStakeHolders = async (req, res) => {
  try {
    const stakeHolders = await StakeHoldersModel.find();
    res.status(200).json({ data: stakeHolders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addStakeHolder,
  updateStakeHolder,
  deleteStakeHolder,
  getStakeHolders,
};