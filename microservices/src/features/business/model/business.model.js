const mongoose = require("mongoose");


const businessSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tag: { type: String, required: true },
  photo: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }
},
{
  timestamps:true
}
);

module.exports = mongoose.model("Business", businessSchema);
