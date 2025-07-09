// const userModel = require("../../../../User/auth/models/userModel");
// const { userorderModel } = require("../../../../user/core/db/order");
// const agencyModel = require("../../../../User/agency/model/agencyModel");
// const employeeModel = require("../../../../User/employees/model/employeesModel");
// const AgencyModel = require("../../../../../models/AgencyModel");
const User = require("../../../../../models/User");
const agencyModel = require("../../../../agency/model/agency.model");
const LivechatModel = require("../../../../livechat/model/Message");
//const livechatModel = require("../../../../livechat/model/Message");
//const orderForms = require("../../../../order-forms");

const getCounterSection = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

   // const totalOrders = await orderForms.countDocuments();

    const totalAgencies = await agencyModel.countDocuments();

    const totalSupport = await LivechatModel.countDocuments();
    //const totalEmployers = await employeeModel.countDocuments();

    res.status(200).json({
      customers: totalUsers,
      //completedOrders: totalOrders,
      ourSupport: totalSupport,
      //employers: totalEmployers,
      agencies: totalAgencies,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getCounterSection };