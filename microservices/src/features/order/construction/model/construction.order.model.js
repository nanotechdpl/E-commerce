const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ConstructionOrderCounter = require("./construction.order.counter.model");

const ConstructionOrderSchema = new schema(
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
      default: "construction",
      enum: ["construction"],
    },
    serviceName: {
      type: String,
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
    workPlace: {
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
    projectType: {
      type: String,
      required: true,
      enum: [
        "Personal",
        "Company",
        "Client",
        "Non-Profit",
        "Government",
        "Collaboaration",
        "Development",
      ],
    },
    priorityLevel: {
      type: String,
      required: true,
      emum: [
        "Low Priority",
        "Medium Priority",
        "High Priority",
        "Normal Priority",
      ],
    },
    priceOrBudget: {
      type: Number,
      required: true,
      default: 0,
    },
    payCurrency: {
      type: String,
      required: true,
    },
    expectedEndDate: {
      type: Date,
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
ConstructionOrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderId) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const counter = await ConstructionOrderCounter.findOneAndUpdate(
          { modelName: "ConstructionOrder" },
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true, session }
        );
        const orderId = counter.sequenceValue.toString().padStart(5, "0");
        this.orderId = `CO${orderId}`;
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

module.exports = mongoose.model("ConstructionOrder", ConstructionOrderSchema);
