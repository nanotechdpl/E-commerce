const mongoose = require("mongoose");
const { SERVICE_CATEGORY } = require("../../../utils/constant");

const ConstructionSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  tag: { type: String },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  category: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("construction", ConstructionSchema);
