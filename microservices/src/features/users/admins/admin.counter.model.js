const mongoose = require("mongoose");

const adminCounterSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    unique: true,
  },
  sequenceValue: {
    type: Number,
    default: 0,
  },
});

const CounterAdmin = mongoose.model("CounterAdmin", adminCounterSchema);

module.exports = CounterAdmin;