const mongoose = require("mongoose");

const CompanyCategory = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CompanyCategorySchema = mongoose.model(
  "conpany_category",
  CompanyCategory
);

module.exports = CompanyCategorySchema;
