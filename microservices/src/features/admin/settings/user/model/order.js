const { userorderModel } = require("../../../../users/core/db/order");
const { orderstatuslogModel } = require("../../../../users/core/db/orderstatuslog");
const userModel = require("../../../../../models/User");

const adminuserorderdashboardModel = async (data, res) => {
  //  const adminuserorderdashboardModel = async (req, res, next) => {

  try {
    const { viewperpage, query } = data;
    //const { viewperpage, status, query } = req.body;

    let userorders;
//    userorders= await userorderModel.find()
//    .populate({
//      path: "orderid",
//      select: "title",
//    }).sort({ createdAt: -1 }).limit();




     if (query.$and.length >= 1) {
       userorders = await userorderModel.find(query).sort({ createdAt: -1 }).limit(viewperpage);
     } else {
       userorders = await userorderModel.find().sort({ createdAt: -1 }).limit(viewperpage);
     }
    const sumuserorders = await userorderModel.find().limit();
    const totalorders = await userorderModel.countDocuments();
    const totalamount = sumuserorders.reduce((accumulator, current) => {
      return accumulator + current.amount;
    }, 0);
    const totalbudget = sumuserorders.reduce((accumulator, current) => {
      return accumulator + current.budget;
    }, 0);
    const totalmoneyleft = sumuserorders.reduce((accumulator, current) => {
      return accumulator + current.balance_amount;
    }, 0);

    const totalpendingorders = await userorderModel.countDocuments({
      status: "pending",
    });
    const totalpaymentorders = await userorderModel.countDocuments({
      status: "payment",
    });
    const totalwaitingorders = await userorderModel.countDocuments({
      status: "waiting",
    });
    const totalworkingorders = await userorderModel.countDocuments({
      status: "working",
    });
    const totalcompletedorders = await userorderModel.countDocuments({
      status: "completed",
    });
    const totaldelivredorders = await userorderModel.countDocuments({
      status: "delivered",
    });
    const totalcancelledorders = await userorderModel.countDocuments({
      status: "cancelled",
    });
    const dashboard = {
      totalorders,
      userorders,
      totalamount,
      totalbudget,
      totalmoneyleft,
      totalwaitingorders,
      totalpaymentorders,
      totalpendingorders,
      totaldelivredorders,
      totalcompletedorders,
      totalworkingorders,
      totalcancelledorders,
    };

    return dashboard;
  } catch (error) {
    console.log(error);
    return error.message;
    // handleError(error.message)(res)
  }
};

const adminretrievesingleuserorderModel = async (data, res) => {
  try {
    const { orderid } = data;
    const order = await userorderModel.findOne({ orderNumber: orderid });
    const statuslog = await orderstatuslogModel.find({ orderid });
    const orderdata = { order, statuslog };
    return orderdata;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
const adminupdateuserorderstatusModel = async (data, res) => {
  try {
    const { orderid, adminid, status } = data;
    const order = await userorderModel.findOne({ orderNumber: orderid });
    if (!order) {
      return { error: `Order with orderNumber ${orderid} not found.` };
    }
    const from = order.status;
    const to = status;
    await userorderModel.findOneAndUpdate({ orderNumber: orderid }, {
      $set: { status },
    });
    const userorderid = order._id;
    const form = await new orderstatuslogModel({
      to,
      from,
      orderid: userorderid,
      adminid,
    });
    const userDetails = await form.save();
    return "success";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
const adminupdateuserordersignatoryModel = async (data, res) => {
  try {
    const { orderid, adminid, signature, signature_type } = data;
    await userorderModel.findOneAndUpdate({ orderNumber: orderid }, {
      $set: {
        admin_signatory: {
          adminid,
          signature,
          signature_type,
        },
      },
    });
    return "success";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const adminsetorderprofitModel = async (data, res) => {
  try {
    const { orderid, adminid, profit, pin, userid } = data;
    await userModel.findByIdAndUpdate(userid, {
      $inc: { "finance.profit": profit },
    });
    await userorderModel.findOneAndUpdate({ orderNumber: orderid }, {
      $set: { profit },
    });
    return "success";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

module.exports = {
  adminupdateuserorderstatusModel,
  adminretrievesingleuserorderModel,
  adminuserorderdashboardModel,
  adminupdateuserordersignatoryModel,
  adminsetorderprofitModel,
};
