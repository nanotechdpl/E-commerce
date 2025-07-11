const mongoose = require("mongoose");

const StakeHoldersSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["map", "logo"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StakeHoldersModel = mongoose.models.StakeHolders || mongoose.model("StakeHolders", StakeHoldersSchema);

module.exports = StakeHoldersModel;