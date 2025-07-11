const mongoose = require("mongoose");

const EmployeeHiringSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    tag: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    hiringKey: {
        type: String,
        enum: ['hiring'],
    },
}, { timestamps: true });
// const EmployeeHiringSchema = new schema(
//   {
//     title: { type: String, required: true },
//   description: { type: String, required: true },
//   category: { type: String, required: true },
//   tag: { type: String, required: true },
//   photo: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active",
//   }
// },
// {
//   timestamps:true
// }
// );

const employeeHiringModel = mongoose.model("employeeHiring", EmployeeHiringSchema);
module.exports = employeeHiringModel;