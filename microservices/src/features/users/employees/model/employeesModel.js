const mongoose = require("mongoose");
const schema = mongoose.Schema;

const EmployeesSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Make name required
    },
    photo: {
      type: String,
      required: false,
    },
    isBestEmployee: {
      type: Boolean,
      default: false,
    },
    rating: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    links: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Create and export the Employee model
const EmployeeModel = mongoose.model("Employee", EmployeesSchema);

module.exports = EmployeeModel;
