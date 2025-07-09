const mongoose = require("mongoose");

const OTPVerificationSchema = new mongoose.Schema({
  userDetails: {
    type: Object,
    required: true,
    email: {
      type: mongoose.Schema.Types.String,
      unique: [true, "Email already exists"],
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: false, // ✅ Mark password as optional
    },
    login_url: {
      type: mongoose.Schema.Types.String,
    },
    access: {
      type: mongoose.Schema.Types.String,
    },
    username: {
      type: mongoose.Schema.Types.String,
    },
    name: {
      type: mongoose.Schema.Types.String,
    },
    // pincode: {
    //   type: mongoose.Schema.Types.String,
    // },
  },
  otpCode: {
    type: mongoose.SchemaTypes.Number,
    min: [6, "OTP must be six digits."],
  },
  otpExpiringtime: {
    type: mongoose.SchemaTypes.Date,
  },
});

// ✅ Modify pre-save hook to make password validation optional
OTPVerificationSchema.pre("save", async function (next) {
  const email = this.userDetails.email;
  const password = this.userDetails.password;

  // Validate email
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b))$/i;
  if (!emailRegex.test(email)) {
    return next(new ReferenceError("Invalid email provided"));
  }

  // ✅ Only validate password if it is provided
  if (password) {
    const strongPasswordPattern =
      /^(?=.*[A-Za-z])(?=.*[A-Z a-z\d ])(?=.*[@$!*#?.&])[A-Za-z\d@$!*.#?&]{10,}$/;
    if (!strongPasswordPattern.test(password)) {
      return next(
        new ReferenceError(
          "Password must contain at least one character, one number, one letter, and be at least 10 characters long."
        )
      );
    }
  }

  next();
});

module.exports = mongoose.model("OTP", OTPVerificationSchema);
