const globalOrbitModel = require("../model/global.orbit.model");

// Add a new globalOrbit item
const addGlobalOrbit = async (req, res) => {
  try {
    const { image, ratings } = req.body;
    const newGlobalOrbitItem = new globalOrbitModel({ image, ratings });
    await newGlobalOrbitItem.save();
    res.status(201).json({ message: "GlobalOrbit item added successfully", data: newGlobalOrbitItem });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update a globalOrbit item
const updateGlobalOrbit = async (req, res) => {
  try {
    const { id, image, ratings } = req.body;
    const updatedGlobalOrbitItem = await globalOrbitModel.findByIdAndUpdate(
      id,
      { image, ratings },
      { new: true }
    );
    if (!updatedGlobalOrbitItem) {
      return res.status(404).json({ message: "GlobalOrbit item not found" });
    }
    res.status(200).json({ message: "GlobalOrbit item updated successfully", data: updatedGlobalOrbitItem });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a globalOrbit item
const deleteGlobalOrbit = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedGlobalOrbitItem = await globalOrbitModel.findByIdAndDelete(id);
    if (!deletedGlobalOrbitItem) {
      return res.status(404).json({ message: "GlobalOrbit item not found" });
    }
    res.status(200).json({ message: "GlobalOrbit item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all globalOrbit items
const getGlobalOrbit = async (req, res) => {
  try {
    const globalOrbitItems = await globalOrbitModel.find();
    res.status(200).json({ data: globalOrbitItems });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addGlobalOrbit,
  updateGlobalOrbit,
  deleteGlobalOrbit,
  getGlobalOrbit,
};