const { Schema, model, models } = require("mongoose");

const subscriptionSchema = new Schema(
  {
    securityDepositAmount: {
      type: Number,
      required: [true, "Security Deposit Amount is required"],
    },
    annualAmount: {
      type: Number,
      required: [true, "Annual Amount is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  models.Subscription || model("Subscription", subscriptionSchema);

module.exports = {
  Subscription,
};
