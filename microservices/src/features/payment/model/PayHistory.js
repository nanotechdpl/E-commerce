const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const paymentHistory = new mongoose.Schema(
  {
    orderId: { type: String },
    amount: { type: String, required: true },
    orderCustomId: { type: String },
    userId: { type: String },
    userEmail: { type: String, required: true },
    tranxId: { type: String },
    status: { type: String },
    payCurrency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      default: "Paypal",
    },
    dueAmount: {
      type: String,
      default: "0",
    },
    charge: {
      type: String,
      default: "0",
    },
    sellerInfo: {
      type: Object,
    },
    type: {
      type: String,
      enum: ["subscription", "order"],
      default: "order",
    },
    amountDetails: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Add the pagination plugin to the schema
paymentHistory.plugin(mongoosePaginate);

module.exports = mongoose.model("PayHistory", paymentHistory);
