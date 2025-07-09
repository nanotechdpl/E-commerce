const mongoose = require("mongoose");

const AgencyCounterSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("AgencyCounter", AgencyCounterSchema);