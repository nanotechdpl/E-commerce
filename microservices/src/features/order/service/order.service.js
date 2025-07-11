const Orders = require("../model/order.model");
const OrderInfo = require("../model/order.info.model");

const getOrderInfoByOrderId = async (orderId) => {
  const orderInfo = await OrderInfo.find({ orderId })
    .populate("adminId", "_id name role");
  return orderInfo;
};



const getAll = async () => {
  return Orders.find().sort({ createdAt: -1 });
};
const getOrderByID = async (id) => {
  return Orders.findOne({ _id: id });
};

const create = async (data) => {
  return new Orders(data).save();
};

const update = async (id, data) => {
  return Orders.findOneAndUpdate({ _id: id }, data, { new: true });
};

const remove = async (id) => {
  return Orders.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getOrderByID,
  create,
  update,
  remove,
  getOrderInfoByOrderId,
};
