const mongoose = require("mongoose");
const schema = mongoose.Schema;
const VisaTravellingOrderCounter = require("./visaTravelling.order.counter.model");

const VisaTravellingOrderSchema = new schema(
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
      default: "visaTravelling",
      enum: ["visaTravelling"],
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
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    currentAddress: {
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
    passportNumber: {
      type: String,
      required: true,
    },
    passportExpiryDate: {
      type: Date,
      required: true,
    },
    visaStatus: {
      type: String,
      required: true,
      enum: ["Present", "To Be Processed"],
    },
    visaType: {
      type: String,
      required: true,
      enum: [
        "Tourist",
        "Business",
        "Student",
        "Work",
        "Transit",
        "Family",
        "Immigrant",
        "Refugee",
        "Diplomatic",
        "Official",
        "Investor",
        "Working Holiday",
        "Medical",
        "Other",
      ],
    },
    travelClass: {
      type: String,
      required: true,
      enum: [
        "Suite Class",
        "First Class",
        "Charter Class",
        "Executive Class",
        "Business Class",
        "Premium Economy Class",
        "Economy Class",
        "Other",
      ],
    },
    destinationAddress: {
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
    passengersNo: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    returnDate: {
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

VisaTravellingOrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderId) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const counter = await VisaTravellingOrderCounter.findOneAndUpdate(
          { modelName: "VisaTravellingOrder" },
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

module.exports = mongoose.model(
  "VisaTravellingOrder",
  VisaTravellingOrderSchema
);
