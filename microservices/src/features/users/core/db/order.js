const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Riderschema = new schema({
  full_name: {
    type: String,
    default: ""
  },
   orderNumber:
  {
    type: String,
    required: true,
    unique: true
  }, // e.g., "ODR001"
  project_requirement: {
    type: String,
    default: ""
  },

  project_type: {
    type: String,
    default: ""
  },
  pay_currency: {
    type: String,
    default: ""
  },

  budget: {
    type: Number,
    default: 0

  },
  project_deadline: {
    type: Date,
    default: Date.now
  },
  reference_name: {
    type: String,
    default: ""
  },
  project_files: [
    {
      file_type: {
        type: String,
        default: ""
      },
      file_url: {
        type: String,
        default: ""
      },
    },
  ],
  minimum_pay: {
    type: Number,
    default: 0

  },
  project_details: {
    type: String,
    default: ""
  },

  accepted_terms: {
    type: Boolean,
    default: false
  },

  user_signatory: {
    signature_type: {
      type: String,
      default: ""
    },
    signature: {
      type: String,
      default: ""
    },
  },

  admin_signatory: {
    signature_type: {
      type: String,
      default: "",
    },
    signature: {
      type: String,
      default: "",
    },
    adminid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },


  work_location: {
    type: String,
    default: ""
  },

  paid_amount: {
    type: Number,
    default: 0
  },
  balance_amount: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    default: "pending"
  },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: "order" },

  createdAt: {
    type: Date,
    default: Date.now
  },
});
const userorderModel = mongoose.model("userorder", Riderschema);
module.exports = {
  userorderModel,
};
