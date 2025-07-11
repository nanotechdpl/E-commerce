const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrderInfoSchema = new schema({
  orderId: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("orderInfo", OrderInfoSchema);
