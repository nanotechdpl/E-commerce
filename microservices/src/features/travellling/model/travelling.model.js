const mongoose = require("mongoose");

const TravellingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  places: { type: Number, default: 0 },
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

module.exports = mongoose.model("Travelling", TravellingSchema);
