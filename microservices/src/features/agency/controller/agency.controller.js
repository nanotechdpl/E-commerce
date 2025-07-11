const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const AgencyModel = require("../model/agency.model");
const User = require("../../../models/User");
const OTPModel = require("../../../models/OtpVerification");
const generateOTP = require("../../../utils/otpGenerator");
const { otpTemplate } = require("../../../templates/otpTemplate");
const {
  sendEmail,
  sendEmailWithTemplate,
} = require("../../../config/mailConfig");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const uploadMiddleware = upload.fields([
  { name: "agencyLogo", maxCount: 1 },
  { name: "agencyDocuments", maxCount: 10 },
  { name: "personalDocuments", maxCount: 10 },
]);

const getExistingUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        title: "Agency Creation error",
        status: 400,
        message: "Please fill out the email field",
      });
    }

    const existingAgency = await AgencyModel.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingAgency) {
      return res.status(400).json({
        title: "Agency Creation error",
        status: 400,
        message: "This Agency already exists",
      });
    }
    if (existingUser) {
      return res.status(400).json({
        title: "Agency Creation error",
        status: 400,
        message: "This User already exists as User",
      });
    }

    return res.status(200).json({
      title: "Registration Process",
      status: 200,
      successful: true,
      message: "Please go to the next step.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      successful: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};

const sentOTPForAgencyCreation = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        title: "Agency Creation error",
        status: 400,
        message: "Please fill out the email field",
      });
    }

    // Check if the user already exists
    const existingUser = await AgencyModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        title: "Registration error",
        status: 400,
        message: "User already exists",
      });
    }

    // Generate OTP
    const otp = await generateOTP();
    const templatePath = "admin.registration.ejs";
    await OTPModel.updateOne(
      { "userDetails.email": email },
      {
        userDetails: { email, password },
        otpCode: otp,
        otpExpiringtime: new Date(Date.now() + 3 * 60 * 1000),
      },
      { upsert: true }
    );

    // Send OTP to user's email
    sendEmail(email, "Create Agency OTP", `Your OTP is: ${otp}`, templatePath)
      .then(() => {
        return res.status(200).json({
          title: "Create Agency OTP",
          status: 200,
          successful: true,
          message: "OTP sent for create agency.",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          title: "Create Agency OTP",
          status: 500,
          successful: false,
          message: "Failed to send OTP.",
          error: err.message,
        });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerAgency = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const existingUser = await AgencyModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        title: "Agency Create error",
        status: 400,
        message: "Email already exists",
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        title: "Verify Agency Creation OTP",
        status: 400,
        successful: false,
        message: "Email and OTP are required.",
      });
    }

    const userOtpDetails = await OTPModel.findOne({
      "userDetails.email": email,
    });
    if (!userOtpDetails || Number(userOtpDetails.otpCode) !== Number(otp)) {
      return res.status(400).json({
        title: "Verify Agency Creation OTP",
        status: 400,
        successful: false,
        message: "Invalid or expired OTP.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate required fields based on the updated schema

    const requiredFields = [
      "fullName",
      "nationality",
      "gender",
      "dateOfBirth",
      "nationalIdOrPassport",
      "phoneNumber",
      "personalEmail",
      "permanentAddress",
      "agencyName",
      "serviceDivision",
      "serviceArea",
      "grade",
      "employees",
      "officeAddress",
      "phoneNumberOffice",
      "officeEmail",
      "description",
      "currency",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Field '${field}' is required` });
      }
    }

    // Check if an agency with the same name already exists
    const existingAgency = await AgencyModel.findOne({
      agencyName: req.body.agencyName,
    });

    if (existingAgency) {
      return res
        .status(400)
        .json({ message: "An agency with this name already exists" });
    }

    // Create the new agency
    const newAgency = new AgencyModel({
      // userId: newUser.userUID,
      email,
      password: hashedPassword,
      fullName: req.body.fullName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      // dateOfBirth: new Date(req.body.dateOfBirth),
      // dateOfBirth: new Date(req.body.dateOfBirth).toISOString(),
      // dateOfBirth: new Date(req.body.dateOfBirth).toLocaleDateString(),
      // dateOfBirth: new Date(req.body.dateOfBirth).toString(),
      // dateOfBirth: new Date(req.body.dateOfBirth).toUTCString(),
      nationality: req.body.nationality,
      nationalIdOrPassport: req.body.nationalIdOrPassport,
      phoneNumber: req.body.phoneNumber,
      personalEmail: req.body.personalEmail,
      permanentAddress: req.body.permanentAddress,
      personalDocuments: req.files["personalDocuments"]
        ? req.files["personalDocuments"].map((file) => file.path)
        : [],
      agencyLogo: req.files["agencyLogo"]
        ? req.files["agencyLogo"][0].path
        : null,
      agencyName: req.body.agencyName,
      serviceDivision: req.body.serviceDivision,
      serviceArea: req.body.serviceArea,
      grade: req.body.grade,
      employees: req.body.employees,
      officeAddress: req.body.officeAddress,
      phoneNumberOffice: req.body.phoneNumberOffice,
      officeEmail: req.body.officeEmail,
      agencyDocuments: req.files["agencyDocuments"]
        ? req.files["agencyDocuments"].map((file) => file.path)
        : [],
      // agencyDocuments: req.files["agencyDocuments"]
      //   ? req.files["agencyDocuments"].map((file) => file.path)
      //   : [],
      description: req.body.description,
      currency: req.body.currency,
      feeAmount: req.body.feeAmount,
      depositAmount: req.body.depositAmount,
      status: "Pending",
    });

    // Save the agency to the database
    const registeredAgency = await newAgency.save();

    // Delete OTP record after successful registration
    await OTPModel.deleteOne({ "userDetails.email": email });

    // Respond with success
    res.status(201).json({
      title: "Agency Creation",
      status: 201,
      successful: true,
      message: "Agency registration submitted successfully",
      agency: registeredAgency,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering agency", error: error.message });
  }
};

const createAgency = async (req, res) => {
  try {
    const { email, password } = req.body;

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Validate required fields based on the updated schema

    const requiredFields = [
      "email",
      "password",

      "fullName",
      "nationality",
      "gender",
      "dateOfBirth",
      "nationalIdOrPassport",
      // "phoneNumber",
      // "personalEmail",
      "permanentAddress",
      "agencyName",
      "serviceDivision",
      "serviceArea",
      "grade",
      "employees",
      "officeAddress",
      "phoneNumberOffice",
      "officeEmail",
      "description",
      "currency",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Field '${field}' is required` });
      }
    }

    const existingUser = await AgencyModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        title: "Agency Create error",
        status: 400,
        message: "Email already exists",
      });
    }

    // Check if an agency with the same name already exists
    const existingAgency = await AgencyModel.findOne({
      agencyName: req.body.agencyName,
    });

    if (existingAgency) {
      return res
        .status(400)
        .json({ message: "An agency with this name already exists" });
    }

    const otp = await generateOTP();
    const templatePath = "user.registration.ejs";
    await OTPModel.updateOne(
      { "userDetails.email": email },
      {
        userDetails: {
          email,
          password,

          fullName: req.body.fullName,
          gender: req.body.gender,
          dateOfBirth: req.body.dateOfBirth,
          nationality: req.body.nationality,
          nationalIdOrPassport: req.body.nationalIdOrPassport,
          permanentAddress: req.body.permanentAddress,
          personalDocuments: req.body.personalDocuments,

          agencyLogo: req.body.agencyLogo,
          agencyName: req.body.agencyName,
          serviceDivision: req.body.serviceDivision,
          serviceArea: req.body.serviceArea,
          grade: req.body.grade,
          employees: req.body.employees,
          officeAddress: req.body.officeAddress,
          currency: req.body.currency,
          phoneNumberOffice: req.body.phoneNumberOffice,
          officeEmail: req.body.officeEmail,
          agencyDocuments: req.body.agencyDocuments,
          description: req.body.description,

          feeAmount: req.body.feeAmount,
          depositAmount: req.body.depositAmount,
          status: "Pending",
        },
        otpCode: otp,
        otpExpiringtime: new Date(Date.now() + 3 * 60 * 1000),
      },
      { upsert: true }
    );

    // Send OTP to user's email
    sendEmail(email, "Create Agency OTP", `Your OTP is: ${otp}`, templatePath)
      .then(() => {
        return res.status(200).json({
          title: "Create Agency OTP",
          status: 200,
          success: true,
          message: "OTP sent for create agency.",
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(200).json({
          title: "Create Agency OTP",
          status: 200,
          successful: true,
          error: err.message,
        });
      });
    // Respond with success
    // res.status(201).json({
    //   title: "Agency Creation",
    //   status: 201,
    //   successful: true,
    //   message: "Agency registration submitted successfully",
    //   agency: registeredAgency,
    // });
  } catch (error) {
    console.error(error?.message);
    res
      .status(500)
      .json({ message: "Error registering agency", error: error.message });
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
    const {
      email,
      password,

      fullName,
      nationality,
      gender,
      dateOfBirth,
      nationalIdOrPassport,
      permanentAddress,

      agencyName,
      serviceDivision,
      serviceArea,
      grade,
      employees,
      officeAddress,
      phoneNumberOffice,
      officeEmail,
      description,
      currency,

      feeAmount,
      depositAmount,
      status,
    } = userOtpDetails.userDetails;
    // console.log('name, password:', name, password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAgencyUser = new AgencyModel({
      email,
      password: hashedPassword,

      fullName,
      nationality,
      gender,
      dateOfBirth,
      nationalIdOrPassport,
      permanentAddress,

      agencyName,
      serviceDivision,
      serviceArea,
      grade,
      employees,
      officeAddress,
      phoneNumberOffice,
      officeEmail,
      description,
      currency,

      // feeAmount,
      // depositAmount,
    });
    await newAgencyUser.save();

    // Delete OTP record after successful registration
    await OTPModel.deleteOne({ "userDetails.email": email });

    return res.status(201).json({
      title: "Registration Successfull",
      status: 201,
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      title: "Registration Error",
      status: 500,
      success: false,
      message: "Error registering user.",
      error: error.message,
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

    const findUser = await AgencyModel.findOne({ email });
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
        agencyId: findUser.agencyId,
        token,
      },
      user_two_fact: true,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginAgency = async (req, res) => {
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
    const existingUser = await AgencyModel.findOne({ email });
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
      agency: {
        id: existingUser.id,
        agencyId: existingUser.agencyId,
        fullName: existingUser.fullName,
        email: existingUser.email,
        currency: existingUser.currency,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      title: "Login Message",
      status: 500,
      message: "Internal Server error",
    });
  }
};

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

  const user = await AgencyModel.findOne({ email });
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
    // Log request data

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
    //   const salt = await passwordHasher.genSalt(10);
    //   const hashedPassword = await passwordHasher.hash(newPassword, salt);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update user password
    const updateResult = await AgencyModel.updateOne(
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

const updateAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phoneNumberOffice,
      officeEmail,
      description,
      employees,
      socialLinks,
      twoFaAuthentication,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        title: "Update Agency",
        status: 400,
        message: "Agency ID is required.",
      });
    }

    const existingAgency = await AgencyModel.findById(id);

    if (!existingAgency) {
      return res.status(404).json({
        title: "Update Agency",
        status: 404,
        message: "Agency not found.",
      });
    }

    const updateData = {
      phoneNumberOffice: phoneNumberOffice,
      officeEmail: officeEmail,
      description: description,
      employees: employees,
      socialLinks: socialLinks,
      twoFaAuthentication: twoFaAuthentication,
    };

    const updatedAgency = await AgencyModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      title: "Update Agency",
      status: 200,
      successful: true,
      message: "Agency updated successfully.",
    });
  } catch (error) {
    console.error("Error updating agency:", error);
    res.status(500).json({
      title: "Update Agency",
      status: 500,
      successful: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
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
    const agency = await AgencyModel.findById(userId);

    if (!agency) {
      return res.status(404).json({
        title: "Change Password",
        status: 404,
        successful: false,
        message: "User not found.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      agency.password
    );

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

    agency.password = hashedPassword;
    await agency.save();

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

const getAgencyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        title: "Get Agency",
        status: 400,
        message: "Agency ID is required.",
      });
    }

    const agency = await AgencyModel.findById(id);

    if (!agency) {
      return res.status(404).json({
        title: "Get Agency",
        status: 404,
        message: "Agency not found.",
      });
    }
    return res.status(200).json({
      title: "Get Agency",
      status: 200,
      successful: true,
      message: "Agency retrieved successfully.",
      agency,
    });
  } catch (error) {
    return res.status(500).json({
      title: "Get Agency",
      status: 500,
      successful: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};
const getAllAgencies = async (req, res) => {
  try {
    let query = {};

    // Apply filters based on query parameters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.serviceDivision) {
      query.serviceDivision = req.query.serviceDivision;
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive search
    }

    // Fetch agencies with applied filters
    const agencies = await AgencyModel.find(query);

    res.status(200).json({
      success: true,
      count: agencies.length,
      agencies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAgencyExceptPending = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const regex = new RegExp(searchQuery, "i");

    // Dynamically determine fields to search
    const searchableFields = ["name", "email", "address"]; // Ideally, this should come from schema introspection

    const searchConditions = searchableFields.map((field) => ({
      [field]: { $regex: regex },
    }));

    const agencies = await AgencyModel.find({
      status: { $ne: "Pending" },
      $or: searchConditions,
    });

    res.status(200).json({
      success: true,
      count: agencies.length,
      agencies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sentOTPForAgencyCreation,
  registerAgency,
  getExistingUser,
  uploadMiddleware,
  loginAgency,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  updateAgency,
  changePassword,
  getAgencyById,
  sentOTPFor2FA,
  getAllAgencies,
  getAgencyExceptPending,
  createAgency,
  verifyRegistrationOTP,
};
