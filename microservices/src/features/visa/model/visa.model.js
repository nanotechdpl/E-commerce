const mongoose = require("mongoose");
const { VISA_CONTINENET } = require("../../../utils/constant");


const visaSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
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
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Visa", visaSchema);
