const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Riderschema = new schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  adminid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  refundid: { type: mongoose.Schema.Types.ObjectId, ref: "refund" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const refundstatuslogModel = mongoose.model("returnstatuslog", Riderschema);
module.exports = {
  refundstatuslogModel
};
