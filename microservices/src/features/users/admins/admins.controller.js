//import * as adminsService from "./admins.service";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminsService = require("./admins.service");
const Admins = require("./admin.model");

const getSubAdmin = async (req, res, next) => {
  const { search, page, limit, skipId } = req.query;
  try {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const subAdmins = await Admins.find({
      role: "sub-admin",
      _id: { $ne: skipId },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(limitNumber)
      .select("name email _id permissions");

    const totalSubAdmins = await Admins.countDocuments({
      role: "sub-admin",
      _id: { $ne: skipId },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalSubAdmins / limitNumber);

    res.json({
      data: subAdmins?.map((admin) => ({
        name: admin.name,
        email: admin.email,
        _id: admin._id,
        permissions: admin?.permissions?.liveChat,
      })),
      meta: {
        page: pageNumber,
        limit: limitNumber,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    // res.json(await adminsService.getAll());
    const admins = await adminsService.getAll();
    res.json({
      title: "Get All Admins",
      status: 200,
      success: true,
      message: "Admins fetched successfully",
      admins,
    });
  } catch (err) {
    console.error(`Error while getting the lists`, err.message);
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    res.json(await adminsService.get(req.params.id));
  } catch (err) {
    console.error(`Error while getting the list`, err.message);
    next(err);
  }
};

// Extract sub admin code using URL
const subAdminCodeExtractor = (url) => {
  const parsedUrl = new URL(url);
  const subAdminCode = parsedUrl.searchParams.get("subadmin");
  return subAdminCode ? String(subAdminCode) : "";
};

// check if sub admin code is valid
const isSubAdminCodeValid = async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
    });
  }

  try {
    const admin = await Admins.findOne({
      login_code: code,
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
      });
    }

    if (admin?.login_code !== code) {
      return res.status(400).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(`Error while checking the code`, error.message);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { password, login_url } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const logCode = subAdminCodeExtractor(login_url);

    const newAdmin = {
      ...req.body,
      password: hashedPassword,
      login_code: logCode,
    };

    const data = await adminsService.create(newAdmin);

    res.status(201).json({
      title: "Create Admin",
      status: 201,
      success: true,
      message: "Admin created successfully",
      admin: data,
    });
  } catch (err) {
    console.error(`Error while creating the list`, err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    res.json(await adminsService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating the list`, err.message);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    res.json(await adminsService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting the list`, err.message);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await adminsService.login(email, password);
    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      title: "Login Message",
      status: 200,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (err) {
    console.error(`Error while logging in`, err.message);
    console.log(err);
    res.status(400).json({
      title: "Login Message",
      status: 400,
      message: err.message,
    });
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    await adminsService.requestPasswordReset(email);
    res.status(200).json({
      title: "Password Reset Request",
      status: 200,
      successful: true,
      message: "OTP sent for password reset.",
    });
  } catch (err) {
    console.error(`Error while requesting password reset`, err.message);
    res.status(400).json({
      title: "Password Reset Request",
      status: 400,
      message: err.message,
    });
  }
};

const verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await adminsService.verifyPasswordResetOTP(email, otp);
    res.status(200).json({
      title: "Verify Password Reset OTP",
      status: 200,
      successful: true,
      message: "OTP verified. Proceed to reset password.",
    });
  } catch (err) {
    console.error(`Error while verifying OTP`, err.message);
    res.status(400).json({
      title: "Verify Password Reset OTP",
      status: 400,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    await adminsService.resetPassword(email, newPassword);
    res.status(200).json({
      title: "Reset Password",
      status: 200,
      successful: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    console.error(`Error while resetting password`, err.message);
    res.status(400).json({
      title: "Reset Password",
      status: 400,
      message: err.message,
    });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user.id; // Assuming you have a middleware that sets req.user
    await adminsService.changePassword(adminId, oldPassword, newPassword);
    res.status(200).json({
      title: "Change Password",
      status: 200,
      successful: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(`Error while changing password`, err.message);
    res.status(400).json({
      title: "Change Password",
      status: 400,
      message: err.message,
    });
  }
};
// export { getAll, get, create, update, remove };
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
  getSubAdmin,
  isSubAdminCodeValid,
};
