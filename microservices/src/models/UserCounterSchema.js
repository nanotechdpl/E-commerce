const mongoose = require("mongoose");

const userCounterSchema = new mongoose.Schema({
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

const UserCounterModel = mongoose.model("CounterUser", userCounterSchema);

module.exports = UserCounterModel;
