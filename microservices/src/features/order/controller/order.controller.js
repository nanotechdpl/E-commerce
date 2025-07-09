const { sendResponse } = require("../../../utils/helper");
const Orders = require("../model/order.model");
const OrderInfo = require("../model/order.info.model");
const ordersService = require("../service/order.service");
const TechnicalOrder = require("../Technical/model/technical.order.model");
const ConstructionOrder = require("../construction/model/construction.order.model");
const RealEstateOrder = require("../realEstate/model/realEstate.order.model");
const BusinessOrder = require("../business/model/business.order.model");
const EmployeeHiringOrder = require("../employeeHiring/model/employeeHiring.order.model");
const InputExportOrder = require("../InputExport/model/inputExport.order.model");
const VisaTravellingOrder = require("../visa-travelling/model/visaTravelling.order.model");



const updateOrderByIdAndStatus = async (req, res) => {
  const { orderId, serviceType } = req.params;
  const updatedData = req.body;
  const { orderStatus } = updatedData;

  // Mapping serviceType to model
  const serviceModels = {
    technical: TechnicalOrder,
    construction: ConstructionOrder,
    realEstate: RealEstateOrder,
    business: BusinessOrder,
    employeeHiring: EmployeeHiringOrder,
    inputExport: InputExportOrder,
    visaTravelling: VisaTravellingOrder,
  };

  const Model = serviceModels[serviceType];

  if (!Model) {
    return sendResponse(res, 400, false, "Order", "Invalid service type.");
  }

  try {
    // Fetch the current order to compare statuses
    const currentOrder = await Model.findOne({ orderId });

    if (!currentOrder) {
      return sendResponse(res, 404, false, "Order", "Order not found.");
    }

    // Compare orderStatus
    if (orderStatus && currentOrder.orderStatus !== orderStatus) {
      await OrderInfo.create({ 
        orderId: currentOrder.orderId,
        serviceType: serviceType,
        from: currentOrder.orderStatus,
        to: orderStatus,
        adminId: req?.user?.id    
      });
    }

    // Update the order
    const updatedOrder = await Model.findOneAndUpdate(
      { orderId },
      updatedData,
      { new: true }
    );

    return sendResponse(
      res,
      200,
      true,
      "Order",
      "Order updated successfully.",
      updatedOrder
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Server error while updating order."
    );
  }
};

const getOrderInfoByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderInfo = await ordersService.getOrderInfoByOrderId(orderId);

    return sendResponse(res, 200, true, "Order", "Successfully fetched order", {
      orderInfo,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "OrderInfo",
      "Internal server error",
      null,
      error.message
    );
  }
};

const getOrderByIdAndServiceType = async (req, res) => {
  const { orderId, serviceType } = req.params;
  // Mapping serviceType to model
  const serviceModels = {
    technical: TechnicalOrder,
    construction: ConstructionOrder,
    realEstate: RealEstateOrder,
    business: BusinessOrder,
    employeeHiring: EmployeeHiringOrder,
    inputExport: InputExportOrder,
    visaTravelling: VisaTravellingOrder,
  };
  const Model = serviceModels[serviceType];
  // Validate serviceType
  if (!Model) {
    return sendResponse(res, 400, false, "Order", "Invalid service type.");
  }
  try {
    const order = await Model.findOne({ orderId });
    if (!order) {
      return sendResponse(res, 404, false, "Order", "Order not found.");
    }
    return sendResponse(
      res,
      200,
      true,
      "Order",
      "Order fetched successfully.",
      order
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Server error while fetching order."
    );
  }
};

const getAllOrdersStats = async (req, res) => {
  try {
    const { email, orderStatus, serviceType, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (email) filter.userEmail = email;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (serviceType) filter.serviceType = serviceType;

    // Get all orders from all collections
    const technicalOrders = await TechnicalOrder.find(filter);
    const constructionOrders = await ConstructionOrder.find(filter);
    const realEstateOrders = await RealEstateOrder.find(filter);
    const businessOrders = await BusinessOrder.find(filter);
    const employeeHiringOrders = await EmployeeHiringOrder.find(filter);
    const inputExportOrders = await InputExportOrder.find(filter);
    const visaTravellingOrders = await VisaTravellingOrder.find(filter);

    const allOrders = [
      ...technicalOrders,
      ...constructionOrders,
      ...realEstateOrders,
      ...businessOrders,
      ...employeeHiringOrders,
      ...inputExportOrders,
      ...visaTravellingOrders,
    ];

    const orders = [
      ...(await TechnicalOrder.find()),
      ...(await ConstructionOrder.find()),
      ...(await RealEstateOrder.find()),
      ...(await BusinessOrder.find()),
      ...(await EmployeeHiringOrder.find()),
      ...(await InputExportOrder.find()),
      ...(await VisaTravellingOrder.find()),
    ];

    // Pagination
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 10;
    const startIndex = (pageInt - 1) * limitInt;
    const endIndex = startIndex + limitInt;
    const paginatedOrders = allOrders.slice(startIndex, endIndex);

    // Count by status
    const statusCounts = {
      cancel: 0,
      refund: 0,
      delivery: 0,
      complete: 0,
      stopped: 0,
      working: 0,
      payment: 0,
      pending: 0,
    };

    orders.forEach((order) => {
      const status = (order.orderStatus || "").toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
      if (status === "waiting") statusCounts.working++;
    });

    res.status(200).json({
      totalOrders: orders.length,
      totalTechnicalOrders: technicalOrders.length,
      totalConstructionOrders: constructionOrders.length,
      totalRealEstateOrders: realEstateOrders.length,
      totalBusinessOrders: businessOrders.length,
      totalEmployeeHiringOrders: employeeHiringOrders.length,
      totalInputExportOrders: inputExportOrders.length,
      totalVisaTravellingOrders: visaTravellingOrders.length,
      totalCancelOrders: statusCounts.cancel,
      totalRefundedOrders: statusCounts.refund,
      totalDeliveryOrders: statusCounts.delivery,
      totalCompleteOrders: statusCounts.complete,
      totalStoppedOrders: statusCounts.stopped,
      totalWorkingOrders: statusCounts.working,
      totalPaymentOrders: statusCounts.payment,
      totalPendingOrders: statusCounts.pending,
      data: paginatedOrders,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(allOrders.length / limitInt),
      message: "Successfully fetched all orders stats",
      status: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserAllOrders = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return sendResponse(res, 400, false, "Order", "Email is required.");
    }

    const filter = { userEmail: email };

    const orders = [
      ...(await TechnicalOrder.find(filter)),
      ...(await ConstructionOrder.find(filter)),
      ...(await RealEstateOrder.find(filter)),
      ...(await BusinessOrder.find(filter)),
      ...(await EmployeeHiringOrder.find(filter)),
      ...(await InputExportOrder.find(filter)),
      ...(await VisaTravellingOrder.find(filter)),
    ];

    // Count by status
    const statusCounts = {
      cancel: 0,
      refund: 0,
      delivery: 0,
      complete: 0,
      stopped: 0,
      working: 0,
      payment: 0,
      pending: 0,
    };

    orders.forEach((order) => {
      const status = (order.orderStatus || "").toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
      if (status === "waiting") statusCounts.working++;
    });

    return res.status(200).json({
      title: "Order Message",
      status: 200,
      successful: true,
      message: "Successfully fetched user orders.",
      data: orders,
      totalOrders: orders.length,
      totalPendingOrders: statusCounts.pending,
      totalPaymentOrders: statusCounts.payment,
      totalWorkingOrders: statusCounts.working,
      totalStoppedOrders: statusCounts.stopped,
      totalCompleteOrders: statusCounts.complete,
      totalDeliveryOrders: statusCounts.delivery,
      totalRefundedOrders: statusCounts.refund,
      totalCancelOrders: statusCounts.cancel,
    });
  } catch (error) {
    return res.status(500).json({
      title: "Order Message",
      status: 500,
      successful: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createNewOrder = async (req, res) => {
  try {
    const { title, serviceType } = req.body;
    const image = req.file;
    if (!title || !image || !serviceType) {
      return sendResponse(
        res,
        400,
        false,
        "Order",
        "Title and photo are required."
      );
    }
    const photo = image.buffer.toString("base64");
    const newOrder = new Orders({
      title,
      serviceType,
      photo,
    });
    const savedOrder = await ordersService.create(newOrder);
    return sendResponse(
      res,
      200,
      true,
      "Order",
      "Successfully added order.",
      savedOrder
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Internal server error",
      null,
      error.message
    );
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await ordersService.getAll();
    return sendResponse(
      res,
      200,
      false,
      "Order",
      "Successfully fetched orders",
      { orders }
    );
    // res.status(200).json({
    //   title: "Order Message",
    //   status: 200,
    //   successful: true,
    //   message: "successfully fetched orders.",
    //   orders,
    // });
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Internal server error",
      null,
      error.message
    );
    // res.status(500).json({
    //   title: "Order Message",
    //   status: 500,
    //   successful: false,
    //   message: "Internal server error",
    //   error: error.message,
    // });
  }
};

const getOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await ordersService.getOrderByID(id);
    if (!order) {
      return sendResponse(res, 404, false, "Order", "Order not found.");
    }
    return sendResponse(res, 200, true, "Order", "Successfully fetched order", {
      order,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Internal server error",
      null,
      error.message
    );
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, serviceType } = req.body;
    const image = req.file;
    const updateData = { title, serviceType };
    if (image) {
      updateData.photo = image.buffer.toString("base64");
    }
    console.log("updatedOrder:", updateData);
    console.log("id:", id);
    const updatedOrder = await ordersService.update(id, updateData);
    if (!updatedOrder) {
      return sendResponse(res, 404, false, "Order", "Order not found.");
    }
    return sendResponse(
      res,
      200,
      true,
      "Order",
      "Successfully updated order",
      updatedOrder
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Internal server error",
      null,
      error.message
    );
  }
};

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await ordersService.remove(id);
    if (!deletedOrder) {
      return sendResponse(res, 404, false, "Order", "Order not found.");
    }
    return sendResponse(res, 200, true, "Order", "Successfully deleted order");
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Order",
      "Internal server error",
      null,
      error.message
    );
  }
};
module.exports = {
  getAllOrders,
  getOrderByID,
  createNewOrder,
  updateOrder,
  removeOrder,
  getAllOrdersStats,
  getUserAllOrders,
  updateOrderByIdAndStatus,
  getOrderByIdAndServiceType,
  getOrderInfoByOrderId
};
