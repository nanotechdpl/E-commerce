const bcrypt = require("bcryptjs");
const Admins = require("./admin.model");
const generateOTP = require("../../../utils/otpGenerator");
const OTPModel = require("../../../models/OtpVerification");
const { sendEmail } = require("../../../config/mailConfig");
require("dotenv").config();

const getAll = async () => {
  return Admins.find();
};
const get = async (id) => {
  return Admins.findOne({ _id: id });
};

const create = async (data) => {
  return new Admins(data).save();
};

const update = async (id, data) => {
  return Admins.findOneAndUpdate({ _id: id }, data, { new: true });
};

const remove = async (id) => {
  return Admins.findByIdAndDelete(id);
};

const supportService = async (adminId) => {
  try {
    await fetch(`${process.env.SUPPORT_SERVICE_URL}/api/supports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: adminId,
        supportData: {
          defaultMessage: {
            text: "Hello, I am a support agent. How can I help you?",
          },
        },
      }),
    });
  } catch (error) {
    console.error(`Failed to check admin: ${error.message}`);
  }
};

const login = async (email, password) => {
  const admin = await Admins.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, admin.password);
  console.log("Password comparison result:", isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  // check support service are have or not if have then skip ,if not insert one
  await supportService(admin?._id);

  return admin;
};

const requestPasswordReset = async (email) => {
  const admin = await Admins.findOne({ email });
  if (!admin) {
    throw new Error("Admin not found");
  }

  const otp = await generateOTP();
  await OTPModel.updateOne(
    { "userDetails.email": email },
    {
      userDetails: { email },
      otpCode: otp,
      otpExpiringtime: new Date(Date.now() + 3 * 60 * 1000),
    },
    { upsert: true }
  );

  const templatePath = "user.forgotpass.ejs";
  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP is: ${otp}`,
    templatePath
  );
};

const verifyPasswordResetOTP = async (email, otp) => {
  const userOtpDetails = await OTPModel.findOne({ "userDetails.email": email });
  if (!userOtpDetails || Number(userOtpDetails.otpCode) !== Number(otp)) {
    throw new Error("Invalid or expired OTP");
  }
};

const resetPassword = async (email, newPassword) => {
  const otpRecord = await OTPModel.findOne({ "userDetails.email": email });
  if (!otpRecord) {
    throw new Error("OTP record not found. Please request a new OTP.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updateResult = await Admins.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("Password update failed. Admin may not exist.");
  }

  await OTPModel.deleteOne({ "userDetails.email": email });

  const templatePathForResetPassword = "user.forgotpass.ejs";
  await sendEmail(
    email,
    "Password Reset Successful",
    "",
    templatePathForResetPassword
  );
};

const changePassword = async (id, oldPassword, newPassword) => {
  const admin = await Admins.findById(id);
  if (!admin) {
    throw new Error("Admin not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
  if (!isPasswordCorrect) {
    throw new Error("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  admin.password = hashedPassword;
  await admin.save();
};

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  login,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  changePassword,
};
