const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const generateOTP = require("../utils/otpGenerator");
const OTPModel = require("../models/OtpVerification");
const { sendEmail, sendEmailWithTemplate } = require("../config/mailConfig");
const { otpTemplate } = require("../templates/otpTemplate");

const Agency = require("../features/agency/model/agency.model");

const accountSecurity = async (req, res) => {
  const { email } = req.params;
  const { enable } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // find in agency user
      const agencyUser = await Agency.findOne({ email });
      if (!agencyUser) {
        return res.status(404).json({
          message: "Agency user not found",
          status: 404,
        });
      }

      // Update the twoFaAuthentication field
      agencyUser.twoFaAuthentication = enable;
      await agencyUser.save();

      return res.status(200).json({
        message: "Account security updated successfully",
        status: 200,
      });
    }

    // Update the twoFaAuthentication field
    user.twoFaAuthentication = enable;
    await user.save();

    return res.status(200).json({
      message: "Account security updated successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error updating account security",
      status: 500,
    });
  }
};

const getUserInfoByMail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // find in agency user
      const agencyUser = await Agency.findOne({ email });
      if (!agencyUser) {
        return res.status(404).json({
          message: "User not found",
          status: 404,
        });
      }
      return res.status(200).json({
        user: agencyUser,
        message: "User fetched successfully",
        status: 200,
      });
    }

    if (user) {
      return res.status(200).json({
        user,
        message: "User fetched successfully",
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error fetching user",
      status: 500,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      users,
      message: "Users fetched successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error fetching users",
      status: 500,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid User ID format",
        status: 400,
      });
    }

    // Fetch user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    return res.status(200).json({
      user,
      message: "User fetched successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error fetching user",
      status: 500,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, currency, email, password } = req.body;

    // Check if the user has provided all the required fields
    if (!name || !currency || !email || !password) {
      return res.status(400).json({
        title: "Registration error",
        status: 400,
        message: "Please fill out all fields",
      });
    }

    // Check if the password and confirmPassword fields match
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     title: "Registration error",
    //     status: 400,
    //     message: "Passwords do not match",
    //   });
    // }
    // Check if the user already exists
    // const allUsers = await User.find();
    // console.log("allUsers:", allUsers);
    const existingUser = await User.findOne({ email });
    const existingAgency = await Agency.findOne({ email });
    // const existingAgency = await Agency.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        title: "Registration error",
        status: 400,
        error: "User already exists",
        exist: true,
      });
    }
    if (existingAgency) {
      return res.status(400).json({
        title: "Agency Creation error",
        status: 400,
        error: "This User is already exists as Agency",
      });
    }
    // if (existingAgency) {
    //   return res.status(400).json({
    //     title: "Agency Creation error",
    //     status: 400,
    //     message: "This User is already exists as Agency",
    //   });
    // }

    // Generate OTP
    const otp = await generateOTP();
    // console.log('Otp:', otp)
    const templatePath = "user.registration.ejs";
    await OTPModel.updateOne(
      { "userDetails.email": email },
      {
        userDetails: { email, name, password, currency },
        otpCode: otp,
        otpExpiringtime: new Date(Date.now() + 3 * 60 * 1000),
      },
      { upsert: true }
    );

    // Send OTP to user's email
    sendEmail(email, "Registration OTP", `Your OTP is: ${otp}`, templatePath)
      .then(() => {
        return res.status(200).json({
          title: "Registration OTP",
          status: 200,
          successful: true,
          message: "OTP sent for registration.",
        });
      })
      .catch((err) => {
        return res.status(200).json({
          title: "Registration OTP",
          status: 200,
          successful: true,
          message: "Failed to send OTP.",
        });
      });
  } catch (error) {
    console.log("🚀 ~ createUser ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifyRegistrationOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      title: "Verify Registration OTP",
      status: 400,
      successful: false,
      message: "Email and OTP are required.",
    });
  }

  const userOtpDetails = await OTPModel.findOne({ "userDetails.email": email });
  if (!userOtpDetails || Number(userOtpDetails.otpCode) !== Number(otp)) {
    return res.status(400).json({
      title: "Verify Registration OTP",
      status: 400,
      successful: false,
      message: "Invalid or expired OTP.",
    });
  }

  try {
    const { name, password, currency } = userOtpDetails.userDetails;
    // console.log('name, password:', name, password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      currency,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Delete OTP record after successful registration
    await OTPModel.deleteOne({ "userDetails.email": email });

    return res.status(201).json({
      title: "Registration Successfull",
      user: newUser,
      status: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      title: "Registration Error",
      status: 500,
      successful: false,
      message: "Error registering user.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // check if the user provided all the required information
    if (!email || !password) {
      return res.status(400).json({
        title: "Login Message",
        status: 400,
        message: "Please provide email and password",
      });
    }

    // check user is exist or not
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        title: "Login Message",
        status: 400,
        message: "User does not exist",
      });
    }

    // check password is correct or not
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        title: "Login Message",
        status: 400,
        message: "Invalid credentials",
      });
    }

    // if twoFaAuthentication true 2fa authentication will on

    if (existingUser.twoFaAuthentication) {
      // auto random generate 6 digit number
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        await OTPModel.deleteMany({ "userDetails.email": email });

        const createOtp = await OTPModel.create({
          userDetails: { email },
          otpCode: otp,
          otpExpiringtime: new Date(Date.now() + 10 * 60 * 1000),
        });

        // send mail to user email
        await sendEmailWithTemplate({
          to: email,
          subject: "Verification Code.",
          templateFile: otpTemplate({ otpCode: createOtp?.otpCode }),
        });

        return res.status(200).json({
          success: true,
          otp_send: true,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          otp_send: false,
          error: error?.message,
        });
      }
    }
    // generate token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    // send the token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    // send token to user

    return res.status(200).json({
      title: "Login Message",
      status: 200,
      message: "Login successful",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        currency: existingUser.currency,
        token,
      },
    });
  } catch (error) {
    console.log("<<<---login error-->>>", error?.message);
    return res.status(500).json({
      title: "Login Message",
      status: 500,
      message: "Internal Server error",
    });
  }
};

const sentOTPFor2FA = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Please fill out the email field",
        user_two_fact: true,
        success: false,
      });
    }
    // verify user otp
    const findOtp = await OTPModel.findOne({ "userDetails.email": email });
    if (!findOtp) {
      return res.status(400).json({
        otp_not_found: "OTP not found",
        user_two_fact: true,
        success: false,
      });
    }
    // verify otp is expired or not
    if (findOtp.otpExpiringtime < new Date()) {
      return res.status(400).json({
        otp_exp: "OTP is expired",
        user_two_fact: true,
        success: false,
      });
    }
    // verify otp is correct or not
    if (findOtp.otpCode != otp) {
      return res.status(400).json({
        otp_not_match: "OTP is incorrect",
        user_two_fact: true,
        success: false,
      });
    }

    const findUser = await User.findOne({ email });
    // generate token
    const token = jwt.sign(
      { email: findUser.email, id: findUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    // send the token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await OTPModel.deleteOne({ "userDetails.email": email });

    return res.status(200).json({
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
        currency: findUser.currency,
        token,
      },
      user_two_fact: true,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({
      title: "Delete message.",
      status: 400,
      successful: false,
      message: "The payload is wrong ",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        title: "User Management Error",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          title: "Login Message",
          status: 400,
          successful: true,
          message: "Invalid credentials provided.",
        });
      }
      await user.deleteOne();
      return res.status(200).json({
        title: "Delete Account Message",
        status: 200,
        successful: true,
        message: "Account Deleted successfully",
      });
    } else {
      return res.status(404).json({
        title: "User Management Error",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      title: "User Management Error",
      status: 500,
      successful: false,
      message: "Error deleting user account.",
    });
  }
};

const profileUpdate = async (req, res) => {
  //const userId = req.user.id;
  const userId = req.params.id;
  const { name, phone, twoFaAuthentication } = req.body;

  console.log("userId:", userId);
  const updateFields = {};

  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (twoFaAuthentication !== undefined)
    updateFields.twoFaAuthentication = twoFaAuthentication;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid User ID format",
        status: 400,
      });
    }

    // Fetch user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password

    console.log("User-update:", user);
    if (!user) {
      return res.status(400).json({
        title: "Profile update message.",
        status: 400,
        successful: false,
        message: "User not found.",
      });
    }

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        title: "Profile update message.",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }

    // Remove password from response
    const userObject = updatedUser.toObject();
    delete userObject.password;

    return res.status(200).json({
      title: "Profile update message.",
      status: 200,
      successful: true,
      message: "Profile updated successfully.",
      updatedUser: userObject,
    });
  } catch (error) {
    return res.status(500).json({
      title: "Profile update message.",
      status: 500,
      successful: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      title: "Password Reset Request",
      status: 400,
      successful: false,
      message: "Email is required.",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      title: "Password Reset Request",
      status: 400,
      successful: false,
      message: "User with this email does not exist.",
    });
  }

  const otp = await generateOTP();
  const templatePath = "user.forgotpass.ejs";
  console.log("otp:", otp);
  await OTPModel.updateOne(
    { "userDetails.email": email },
    {
      userDetails: { email },
      otpCode: otp,
      otpExpiringtime: new Date(Date.now() + 3 * 60 * 1000),
    },
    { upsert: true }
  );

  sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`, templatePath)
    .then(() => {
      return res.status(200).json({
        title: "Password Reset Request",
        status: 200,
        successful: true,
        message: "OTP sent for password reset.",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        title: "Password Reset Request",
        status: 500,
        successful: false,
        message: "Failed to send OTP.",
        error: err.message,
      });
    });
};

// Verify OTP
const verifyPasswordResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      title: "Verify Password Reset OTP",
      status: 400,
      successful: false,
      message: "Email and OTP are required.",
    });
  }

  const userOtpDetails = await OTPModel.findOne({ "userDetails.email": email });
  if (!userOtpDetails || Number(userOtpDetails.otpCode) !== Number(otp)) {
    return res.status(400).json({
      title: "Verify Password Reset OTP",
      status: 400,
      successful: false,
      message: "Invalid or expired OTP.",
    });
  }

  return res.status(200).json({
    title: "Verify Password Reset OTP",
    status: 200,
    successful: true,
    message: "OTP verified. Proceed to reset password.",
  });
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!email || !newPassword) {
      return res.status(400).json({
        title: "Reset Password",
        status: 400,
        successful: false,
        message: "Email and new password are required.",
      });
    }

    // Check if the user exists in the OTP model
    const otpRecord = await OTPModel.findOne({ "userDetails.email": email });

    if (!otpRecord) {
      return res.status(404).json({
        title: "Reset Password",
        status: 404,
        successful: false,
        message: "OTP record not found. Please request a new OTP.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update user password
    const updateResult = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        title: "Reset Password",
        status: 400,
        successful: false,
        message: "Password update failed. User may not exist.",
      });
    }

    // Delete OTP record after password update
    await OTPModel.deleteOne({ "userDetails.email": email });

    // Send confirmation email
    const templatePathForResetPassword = "user.forgotpass.ejs";
    sendEmail(
      email,
      "Password Reset Successful",
      "",
      templatePathForResetPassword
    );

    return res.status(200).json({
      title: "Reset Password",
      status: 200,
      successful: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      title: "Reset Password",
      status: 500,
      successful: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  console.log("req.user:", req.user);
  const { oldPassword, newPassword, retypePassword } = req.body;

  if (!oldPassword || !newPassword || !retypePassword) {
    return res.status(400).json({
      title: "Change Password",
      status: 400,
      successful: false,
      message: "Old password, new password, and re-type password are required.",
    });
  }

  if (newPassword !== retypePassword) {
    return res.status(400).json({
      title: "Change Password",
      status: 400,
      successful: false,
      message: "New password and re-type password do not match.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        title: "Change Password",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        title: "Change Password",
        status: 400,
        successful: false,
        message: "Old password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      title: "Change Password",
      status: 200,
      successful: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      title: "Change Password",
      status: 500,
      successful: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};
module.exports = {
  createUser,
  verifyRegistrationOTP,
  getUsers,
  loginUser,
  deleteAccount,
  profileUpdate,
  profileUpdate,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  changePassword,
  sentOTPFor2FA,
  getUserById,
  getUserInfoByMail,
  accountSecurity,
};
