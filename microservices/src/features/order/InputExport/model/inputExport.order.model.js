const mongoose = require("mongoose");
const schema = mongoose.Schema;
const InputExportOrderCounter = require("./inputExport.order.counter");

const InputExportOrderSchema = new schema(
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
      default: "input-export",
      enum: ["input-export"],
    },
    serviceName: {
      type: String,
      required: true,
    },
    shippingMethod: {
      type: String,
      required: true,
      enum: [
        "Standard Shipping",
        "International Shipping",
        "Parcel Post",
        "Container Shipping",
      ],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAddress: {
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

InputExportOrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderId) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const counter = await InputExportOrderCounter.findOneAndUpdate(
          { modelName: "InputExportOrder" },
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true, session }
        );
        const orderId = counter.sequenceValue.toString().padStart(5, "0");
        this.orderId = `EIO${orderId}`;
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

module.exports = mongoose.model("InputExportOrder", InputExportOrderSchema);
