const {
  adminretrievealluserorderdashboardModel,
  adminretrievesingleuserModel,
  adminretrievealluserdashboardModel,
  adminretrievealluserpaymentdashboardModel,
  adminretrievealluserrefunddashboardModel,
  admindeleteuseraccountModel,
  adminupdateuserstatusModel,
} = require("../model/user.mgn");

const handleError = require("../../../../../utils/helper");


const adminretrievealluserdashboardController = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    const { status, startdate, enddate, viewperpage } = req.body;
    var query = { $and: [] };

    console.log(status);
    console.log(startdate);
    console.log(enddate);
    console.log(viewperpage);


    if (status != null) {
      query.$and.push({ status: status });
    }
    if (startdate) {
      query.$and.push({ createdAt: { $gte: startdate } });
    }
    if (enddate) {
      query.$and.push({ createdAt: { $lte: enddate } });
    }
    const data = { query, viewperpage };

    console.log("Data: ", data)
    let users = await adminretrievealluserdashboardModel(data, res);

    //console.log("Users: ", users)
    //console.log("Users: ", users)
    console.log(users);
    
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User dashboard retrieved successfully.",
      data: users,
    });
  } catch (error) {
    console.error(error);
    console.log(error)
    return handleError(error.message)(res);
  }
};

const adminretrievesingleuserController = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const data = { userid };

    let user = await adminretrievesingleuserModel(data, res);
    if (!user) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "User not found.",
      });
    }
    
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

const adminupdateuserstatusController = async (req, res, next) => {
  try {
    const { userid, status } = req.body;
    const data = { userid, status };

    let updatedUser = await adminupdateuserstatusModel(data, res);
    if (!updatedUser) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "User not found or status update failed.",
      });
    }
    
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User status updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

const adminretrievealluserorderdashboardController = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const data = { userid };

    let orders = await adminretrievealluserorderdashboardModel(data, res);
    if (!orders) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "No orders found for this user.",
      });
    }

    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

const adminretrievealluserpaymentdashboardController = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const data = { userid };

    let payments = await adminretrievealluserpaymentdashboardModel(data, res);
    if (!payments) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "No payment records found for this user.",
      });
    }

    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User payment records retrieved successfully.",
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

const adminretrievealluserrefunddashboardController = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const data = { userid };

    let refunds = await adminretrievealluserrefunddashboardModel(data, res);
    if (!refunds) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "No refund records found for this user.",
      });
    }

    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User refund records retrieved successfully.",
      data: refunds,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

const admindeleteuseraccountController = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const data = { userid };

    let result = await admindeleteuseraccountModel(data, res);
    if (!result) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "User not found or deletion failed.",
      });
    }

    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "User account deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return handleError(error.message)(res);
  }
};

module.exports = {
  adminretrievealluserdashboardController,
  adminretrievealluserorderdashboardController,
  adminretrievesingleuserController,
  adminretrievealluserrefunddashboardController,
  adminretrievealluserpaymentdashboardController,
  admindeleteuseraccountController,
  adminupdateuserstatusController,
};



















































// const {
//   adminretrievealluserorderdashboardModel,
//   adminretrievesingleuserModel,
//   adminretrievealluserdashboardModel,
//   adminretrievealluserpaymentdashboardModel,
//   adminretrievealluserrefunddashboardModel,
//   admindeleteuseraccountModel,
//   adminupdateuserstatusModel,
// } = require("../../model/user/user.mgn");

// const handleError = require("../../../helper/response");

// const adminretrievealluserdashboardController = async (req, res, next) => {
//   try {
//     const { status, startdate, enddate, viewperpage } = req.body;
//     var query = { $and: [] };

//     if (status != null) {
//       query.$and.push({ user_blocked: status });
//     }
//     if (startdate != "") {
//       query.$and.push({ createdAt: { $gte: startdate } });
//     }
//     if (enddate != "") {
//       query.$and.push({ createdAt: { $lte: enddate } });
//     }
//     const data = { query, viewperpage };
//     let trainee = await adminretrievealluserdashboardModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };

// const adminretrievesingleuserController = async (req, res, next) => {
//   try {
//     const { userid } = req.body;
//     const data = { userid };

//     let trainee = await adminretrievesingleuserModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };

// const adminupdateuserstatusController = async (req, res, next) => {
//   try {
//     const { userid, status } = req.body;
//     const data = { userid, status };

//     let trainee = await adminupdateuserstatusModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };
// const adminretrievealluserorderdashboardController = async (req, res, next) => {
//   try {
//     const { userid } = req.body;
//     const data = { userid };

//     let trainee = await adminretrievealluserorderdashboardModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };
// const adminretrievealluserpaymentdashboardController = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { userid } = req.body;
//     const data = { userid };

//     let trainee = await adminretrievealluserpaymentdashboardModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };
// const adminretrievealluserrefunddashboardController = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { userid } = req.body;
//     const data = { userid };

//     let trainee = await adminretrievealluserrefunddashboardModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };
// const admindeleteuseraccountController = async (req, res, next) => {
//   try {
//     const { userid } = req.body;
//     const data = { userid };

//     let trainee = await admindeleteuseraccountModel(data, res);
//     return res.status(200).json({
//       status_code: 200,
//       status: true,
//       message: "signup process successful",
//       data: trainee,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(error.message)(res);
//   }
// };

// module.exports = {
//   adminretrievealluserdashboardController,
//   adminretrievealluserorderdashboardController,
//   adminretrievesingleuserController,
//   adminretrievealluserrefunddashboardController,
//   adminretrievealluserpaymentdashboardController,
//   admindeleteuseraccountController,
//   adminupdateuserstatusController,
// };
