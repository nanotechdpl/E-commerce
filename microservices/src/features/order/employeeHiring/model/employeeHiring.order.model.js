const mongoose = require("mongoose");
const schema = mongoose.Schema;
const EmployeeHiringOrderCounter = require("./employeeHiring.order.counter.model");

const EmployeeHirinOrderSchema = new schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    visibility: {
      type: mongoose.Schema.Types.Mixed,
      default: "everyone",
    },
    serviceCopy: {
      type: String,
      default: "",
    },
    profit: {
      type: Number,
      default: 0,
    },
    serviceType: {
      type: String,
      default: "employeeHiring",
      enum: ["employeeHiring"],
    },
    serviceName: {
      type: Object,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    secureIdentity: {
     type: Object,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    permanentAddress: {
      country: {
        type: String,
        required: true,
      },
      stateOrProvince: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      ziporPostalCode: {
        type: String,
        required: true,
      },
    },
    employeeLocation: {
      type: String,
      required: true,
      enum: ["Local", "Foreigner"],
    },
    workLocation: {
      type: String,
      required: true,
      enum: [
        "On-Site",
        "Remote",
        "Hybrid",
        "Field-based",
        "Client-Site",
        "Co-working-Space",
        "Flexible",
      ],
    },
    employmentType: {
      type: String,
      required: true,
      enum: [
        "Full-time",
        "Part-time",
        "Contractual",
        "Temporary",
        "Intern",
        "Seasonal",
        "Volunteer",
        "Casual",
        "Apprenticeship",
      ],
    },
    employeesNo: {
      type: String,
      required: true,
    },

    salaryOrBudget: {
      type: Number,
      required: true,
      default: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expectedEndDate: {
      type: Date,
      required: true,
    },

    payCurrency: {
      type: String,
      required: true,
    },
    provideDocument: {
      type: String,
      required: true,
    },
    referenceName: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "payment",
        "waiting",
        "stopped",
        "complete",
        "delivery",
        "refund",
        "cancel",
      ],
    },
  },
  {
    timestamps: true,
  }
);

EmployeeHirinOrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderId) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const counter = await EmployeeHiringOrderCounter.findOneAndUpdate(
          { modelName: "technicalOrder" },
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true, session }
        );
        const orderId = counter.sequenceValue.toString().padStart(5, "0");
        this.orderId = `EHO${orderId}`;
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
    next(error);
  }
});

module.exports = mongoose.model("EmployeeHirinOrder", EmployeeHirinOrderSchema);
