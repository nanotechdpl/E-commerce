const mongoose = require("mongoose");
const { SERVICE_DIVISIONS } = require("../../../utils/constant");

let OrderFormSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.String,
  // },
  // agencyId: {
  //   type: mongoose.Schema.Types.String,
  // },
  orderCreatorId: {
    type: mongoose.Schema.Types.String,
  },
  fullName: {
    type: mongoose.Schema.Types.String,
  },
  phoneNumber: {
    type: mongoose.Schema.Types.String,
  },
  email: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.]*)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b))$/i;
        return value.match(re);
      },
      message: "Please enter a valid email",
    },
  },
  requirements: {
    type: mongoose.Schema.Types.String,
    enum: ["General", "Medium", "Emergenc"],
  },
  type: {
    type: mongoose.Schema.Types.String,
    enum: ["Personal", "Company", "Government", "Developmental", "Non profit"],
  },
  employeeLocation: {
    type: mongoose.Schema.Types.String,
    enum: ["Anyone", "Native", "Foreigner", "Other"],
  },
  location: {
    type: mongoose.Schema.Types.String,
    enum: ["Locally", "Remotely", "Other"],
  },

  hiringPeriod: {
    type: mongoose.Schema.Types.String,
    enum: ["Contractual", "Daily", "Monthly", "Annual"],
  },
  employeeNo: {
    type: mongoose.Schema.Types.String,
  },
  description: {
    type: mongoose.Schema.Types.String,
  },
  referrenceName: {
    type: mongoose.Schema.Types.String,
  },
  documents: {
    type: [mongoose.Schema.Types.String],
  },
  //Ony when category is Export
  address: {
    type: mongoose.Schema.Types.String,
  },
  shippingMethod: {
    type: mongoose.Schema.Types.String,
    enum: ["Air Freight", "Sea Freight", "Land Transport", "Courier Services"],
  },
  quantity: {
    type: mongoose.Schema.Types.String,
  },
  //Only when category is Visa and For Travelling departure date is required
  nationality: {
    type: mongoose.Schema.Types.String,
  },
  visaType: {
    type: mongoose.Schema.Types.String,
    enum: [
      "Tourist",
      "Business",
      "Work",
      "Student",
      "Transit",
      "Family",
      "Immigrant",
      "Refugee or Asylum",
      "Diplomatic or Official",
      "Investor or Entrepreneur",
      "Working Holiday",
      "Medical",
      "Other Special",
    ],
  },
  passportNumber: {
    type: mongoose.Schema.Types.String,
  },
  destination: {
    type: mongoose.Schema.Types.String,
  },
  departureDate: {
    type: mongoose.Schema.Types.Date,
  },
  returnDate: {
    type: mongoose.Schema.Types.Date,
  },
  propertyType: {
    type: mongoose.Schema.Types.String,
    enum: ["Residential", "Commercial", "Industrial", "Other"],
  },
  propertyStatus: {
    type: mongoose.Schema.Types.String,
    enum: ["Rental", "Purchase", "Sale", "Lease", "Other"],
  },
  propertyAddress: {
    type: mongoose.Schema.Types.String,
  },
  meetingLocation: {
    type: mongoose.Schema.Types.String,
    enum: ["Physical", "Virtual"],
  },
  meetingType: {
    type: mongoose.Schema.Types.String,
    enum: ["Team", "Client", "Board", "Project"],
  },
  duration: {
    type: mongoose.Schema.Types.String,
  },
  schedule: {
    type: mongoose.Schema.Types.Date,
  },
  terms: {
    type: mongoose.Schema.Types.Boolean,
    default: true,
  },
  category: {
    type: String,
    required: true,
    enum: SERVICE_DIVISIONS,
  },
  status: {
    type: String,
    enum: ["Pending", "Payment", "Warning", "Working", "Complete"],
    default: "Pending",
  },
  amount: {
    type: String,
  },
  dueAmount: {
    type: String,
  },
  paidAmount: {
    type: String,
  },
  deadLine: {
    type: mongoose.Schema.Types.Date,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrderForm", OrderFormSchema);
