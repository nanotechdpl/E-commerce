const { userorderModel } = require("../../../../users/core/db/order");
const {
  adminuserorderdashboardModel,
  adminretrievesingleuserorderModel,
  adminupdateuserorderstatusModel,
  adminupdateuserordersignatoryModel,
  adminsetorderprofitModel,
} = require("../model/order");

const handleError = require("../../../../../utils/helper");

const adminuserorderdashboardController = async (req, res, next) => {
  try {
    const { status, startdate, enddate, viewperpage } = req.body;
    var query = { $and: [] };

    if (status != '') {
      query.$and.push({ status: status });
    }
    if (startdate != "") {
      query.$and.push({ createdAt: { $gte: startdate } });
    }
    if (enddate != "") {
      query.$and.push({ createdAt: { $lte: enddate } });
    }
    const data = { query, viewperpage };
    let trainee = await adminuserorderdashboardModel(data, res);
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "successful",
      data: trainee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
const adminretrievesingleuserorderController = async (req, res, next) => {
  try {
    const { orderid } = req.body;
    const data = { orderid };

    let trainee = await adminretrievesingleuserorderModel(data, res);
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "successful",
      data: trainee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const adminupdateuserorderstatusController = async (req, res, next) => {
  try {
    const { orderid, status, pin } = req.body;

    const adminid = req.user._id;

    const data = { orderid, adminid, status, pin };

    let trainee = await adminupdateuserorderstatusModel(data, res);
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "successful",
      data: trainee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
const adminupdateuserorderprofitController = async (req, res, next) => {
  try {
    const { orderid, profit, pin } = req.body;

    const adminid = req.user._id;

    const order = await userorderModel.findById(orderid);
    if (order.profit != 0) {
      return res.status(400).json({
        status_code: 400,
        status: true,
        message: "order profit already set",
      });
    }
    const userid = order.userid;
    const data = { orderid, adminid, profit, pin, userid };

    let trainee = await adminsetorderprofitModel(data, res);
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "successful",
      data: trainee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
const adminupdateuserordersignatoryController = async (req, res, next) => {
  try {
    const { orderid, signature, signature_type } = req.body;

    const adminid = req.user._id;

    const data = { orderid, adminid, signature, signature_type };

    let trainee = await adminupdateuserordersignatoryModel(data, res);
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "successful",
      data: trainee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  adminupdateuserorderstatusController,
  adminretrievesingleuserorderController,
  adminuserorderdashboardController,
  adminupdateuserordersignatoryController,
  adminupdateuserorderprofitController,
};
