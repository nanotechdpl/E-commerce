const mongoose = require('mongoose');
const UserCounterModel = require('./UserCounterSchema');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: [true, 'Email already exists'],
    validate: {
      validator: (value) => {
        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);  
      },
      message: 'Email is not valid', 
    },
  },
  currency: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  status:{
    type:String,
    enum: ["active", "suspend", "block","dormant","closed"],
    default: "active",
  },
  
  role: {
    type: mongoose.Schema.Types.String,
    enum: ["user", "admin", "agency"],
    default: "user",
  },
  twoFaAuthentication: {
    type : Boolean,
    default: false
  },

  twoFaMethod: { type: String, enum: ['email', 'phone'], default: 'email' },


    userUID: {
    type: mongoose.Schema.Types.String,
    unique: [true, "userUID is unique."],
  },
  finance: {
    total_order: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    total_paid: { type: Number, default: 0 },
    money_left: { type: Number, default: 0 },
    refund_amount: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
  },
  recoveryFeePaid: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletionReason: { type: String },
  contacts: [
    {
      type: {
        type: String,
        enum: ['email', 'phone'],
        required: true,
      },
      value: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
    }
  ],
  profilePhoto: { type: String },
  nationality: { type: String },
  dateOfBirth: { type: Date },
  identityNumber: { type: String },
  identityDocument: { type: String },

},
{
  timestamps:true
});

UserSchema.pre("save", async function (next) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const counterDoc = await UserCounterModel.findOneAndUpdate(
      { modelName: "User" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true, session }
    );

    const userId = counterDoc.sequenceValue.toString().padStart(5, "0"); // Ensure UID format like C00001, etc.
    this.userUID = `C${userId}`;

    await session.commitTransaction();
    session.endSession();
    next();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error generating userUID:", error);
    next(error);
  }
});





const User = mongoose.model('Users', UserSchema);

module.exports = User;