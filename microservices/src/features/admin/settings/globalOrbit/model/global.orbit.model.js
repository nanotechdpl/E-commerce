const mongoose = require("mongoose");
const schema = mongoose.Schema;

const GlobalOrbitSchema = new schema({
  image: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const globalOrbitModel = mongoose.model("global_orbit", GlobalOrbitSchema);
module.exports = globalOrbitModel;