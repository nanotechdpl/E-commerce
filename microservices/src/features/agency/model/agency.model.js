const mongoose = require("mongoose");
const SocialLinkSchema = require("../../../models/SocialLinkModel");
const AgencyCounterModel = require("./agency.counter.model");

const AgencySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Email already exists"],
      validate: {
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value); // ✅ Corrected validation
        },
        message: "Email is not valid", // ✅ Fix message format
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    // Personal Information
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    nationalIdOrPassport: { type: String, required: true, unique: true },
    permanentAddress: { type: String },
    personalDocuments: [{ type: String }],
    // Agency Information
    agencyLogo: { type: String },
    agencyName: { type: String, required: true, unique: true },
    serviceDivision: { type: String, required: true },
    // serviceDivision: { type: String, required: true, enum: ["Technical", "Construction", "Export", "Visa", "Traveling", "Hiring", "Real Estate","Business","Other"] },
    serviceArea: { type: String },
    grade: { type: String },
    // grade: { type: String, enum: ["A", "B", "C", "D", "E", "F"] },
    employees: {
      type: String,
      required: true,
    },
    //  employees: {
    //     type: String,
    //     enum: [
    //       "01-30",
    //       "30-70",
    //       "70-150",
    //       "150-300",
    //       "300-500",
    //       "500-700",
    //       "700-1000+"
    //     ],
    //     required: true
    // },
    // employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    officeAddress: { type: String },
    currency: { type: String, required: true },
    phoneNumberOffice: { type: String, required: true },
    officeEmail: { type: String, required: true },
    agencyDocuments: [{ type: String }],
    description: { type: String },
    feeAmount: { type: Number, default: 0 },
    depositAmount: { type: Number, default: 0 },

    // Other Fields
    // userId: {
    //   type: String,
    //   required: true,
    // },
    agencyId: {
      type: String,
      unique: true,
    },
    socialLinks: [SocialLinkSchema],
    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
    },
    twoFaAuthentication: {
      type: Boolean,
      default: false,
    },
    ranking: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

AgencySchema.pre("save", async function (next) {
  try {
    if (!this.agencyId) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const counter = await AgencyCounterModel.findOneAndUpdate(
          { modelName: "Agency" },
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true, session }
        );

        const agencyId = counter.sequenceValue.toString().padStart(5, "0");
        this.agencyId = `A${agencyId}`;

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    }
    next();
  } catch (error) {
    console.error("Error in pre-validate hook:", error);
    next(error);
  }
});

// const AgencyModel = mongoose.model("Agency", agencySchema);

// module.exports = AgencyModel;
module.exports = mongoose.model("Agency", AgencySchema);
