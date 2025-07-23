const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrderSchema = new schema({
  user_signatory: {
    signature_type: String,
    signature: String,
  },
  admin_signatory: {
    signature_type: String,
    signature: String,
  },
  full_name: String,
  orderId: String,
  project_requirement: String,
  email: String,
  project_type: String,
  payCurrency: String,
  serviceName: String,
  serviceType: {
    type: String,
    required: true,
  },
  priceOrBudget: Number,
  salaryOrBudget: Number,
  project_deadline: String,
  projectType: String,
  minimum_pay: Number,
  project_details: String,
  accepted_terms: Boolean,
  work_location: String,
  paid_amount: Number,
  balance_amount: Number,
  profit: Number,
  orderStatus: String,
  userid: String,
  orderid: String,
  project_files: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  __v: Number,
});

module.exports = mongoose.model("order", OrderSchema);
