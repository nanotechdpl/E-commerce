const mongoose = require("mongoose");
const schema = mongoose.Schema;
const RealEstateOrderCounter = require("./realEstate.order.counter.model");

const RealEstateOrderSchema = new schema(
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
      default: "realEstate",
      enum: ["realEstate"],
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
    rentalAgreementPeriodStart: {
      type: Date,
      required: true,
    },
    rentalAgreementPeriodEnd: {
      type: Date,
      required: true,
    },
    priceOrBudget: {
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
    contractDate: {
      type: Date,
      required: true,
    },
    contractDateStart: {
      type: Date,
      required: true,
    },
    contractDateEnd: {
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

RealEstateOrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderId) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const counter = await RealEstateOrderCounter.findOneAndUpdate(
          { modelName: "RealEstateOrder" },
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true, session }
        );
        const orderId = counter.sequenceValue.toString().padStart(5, "0");
        this.orderId = `EO${orderId}`;
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

module.exports = mongoose.model("RealEstateOrder", RealEstateOrderSchema);
