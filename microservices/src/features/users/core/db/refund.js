const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Riderschema = new schema({
  account_name: {
    type: String,
  },
    returnNumber: {
      type: String,
      unique: true,
    },
  bank_name : {
    type: String,
  },
  account_number: {
    type: String,
  },
  routing_number: {
    type: String,
  },
  code: {
    type: String,
  },
  transaction_receipt: {
    type: String,
  },
  additional_note: {
    type: String,
  },
  reason: {
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
      default :"pending"
  },
  
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: "userorder" },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Riderschema.pre("save", async function (next) {
  if (!this.returnNumber) {
    try {
      const lastReturn = await mongoose
        .model("returns")
        .findOne()
        .sort({ createdAt: -1 });

      const lastReturnNumber = lastReturn?.returnNumber || "R0000";
      const numericPart = parseInt(lastReturnNumber.slice(1), 10);

      const newReturnNumber = `R${String(numericPart + 1).padStart(4, "0")}`;
      this.returnNumber = newReturnNumber;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const refundModel = mongoose.model("returns", Riderschema);
module.exports = {
  refundModel,
};
