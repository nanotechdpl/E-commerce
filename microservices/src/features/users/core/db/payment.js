const { boolean } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;


const Riderschema = new schema({
  account_holder_name: {
    type: String,
  },
  account_name: {
    type: String,
  },
  PaymentNumber: {
    type: String,
    unique: true, // Ensure the PaymentNumber is unique
  },
  payment_type: {
      type: String,
      enum: ["order_payment", "agency_payment"],
      default: "order_payment"
  },
  bank_number: {
    type: String,
  },
  account_number: {
    type: String,
  },
  transaction_id: {
    type: String,
  },
  transaction_receipt: {
    type: String,
  },
  accepted_terms: {
    type: Boolean,
    default: false,
  },
  additional_note: {
    type: String,
  },
  amount: {
    type: Number,
  },
  bank_wallet: {
    type: String,
  },
  currency: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  bankid: { type: mongoose.Schema.Types.ObjectId, ref: "bank" },
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: "userorder" },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to generate PaymentNumber
Riderschema.pre("save", async function (next) {
  if (!this.PaymentNumber) {
    try {
      const lastPayment = await mongoose
        .model("userpayment")
        .findOne()
        .sort({ createdAt: -1 });

      // Extract the numeric part from the last PaymentNumber
      const lastPaymentNumber = lastPayment?.PaymentNumber || "P0000";
      const numericPart = parseInt(lastPaymentNumber.slice(1), 10);

      // Increment the numeric part and format it
      const newPaymentNumber = `P${String(numericPart + 1).padStart(4, "0")}`;
      this.PaymentNumber = newPaymentNumber;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const paymentModel = mongoose.model("userpayment", Riderschema);

module.exports = {
  paymentModel,
};
