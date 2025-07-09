const mongoose = require("mongoose");
const { SERVICE_DIVISIONS } = require("../../../utils/constant");
const schema = mongoose.Schema;

const OrderSchema = new schema({
  photo: {
    type: String,
  },
  serviceType: {
    type: String,
    required: true,
    enum: SERVICE_DIVISIONS,
  },
  title: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", OrderSchema);
