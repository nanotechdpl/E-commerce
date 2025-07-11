const RealEstateOrder = require("../model/realEstate.order.model");

const createOrder = async (req, res) => {
  try {
    const {
      serviceName,
      fullName,
      nationality,
      dateOfBirth,
      secureIdentity,
      phone,
      email,
      permanentAddress,
      rentalAgreementPeriodStart,
      rentalAgreementPeriodEnd,
      priceOrBudget,

      contractDate,
      contractDateStart,
      contractDateEnd,
      payCurrency,
      provideDocument,
      referenceName,
      description,
      userEmail,
    } = req.body;

    const requiredFields = [
      "fullName",
      "nationality",
      "dateOfBirth",
      "secureIdentity",
      "phone",
      "email",
      "permanentAddress",
      "rentalAgreementPeriodStart",
      "rentalAgreementPeriodEnd",
      "priceOrBudget",
      "contractDate",
      "contractDateStart",
      "contractDateEnd",
      "payCurrency",
      "referenceName",
      "userEmail",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `Field '${field}' is required`,
          success: false,
          status: 400,
        });
      }
    }

    const order = new RealEstateOrder({
      serviceName,
      fullName,
      nationality,
      dateOfBirth,
      secureIdentity,
      phone,
      email,
      permanentAddress,
      rentalAgreementPeriodStart,
      rentalAgreementPeriodEnd,
      priceOrBudget,

      contractDate,
      contractDateStart,
      contractDateEnd,
      payCurrency,
      provideDocument,
      referenceName,
      description,
      userEmail,
      dueAmount: priceOrBudget,
    });

    const savedOrder = await order.save();
    res.status(201).json({
      success: true,
      message: "Real Estate order created successfully",
      data: savedOrder,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Real Estate order",
      error: error.message,
      status: 500,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await RealEstateOrder.find();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all Real Estate orders",
      data: orders,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

const getOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await RealEstateOrder.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        status: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched order",
      data: order,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await RealEstateOrder.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        status: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully deleted order",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
      fullName,
      nationality,
      dateOfBirth,
      secureIdentity,
      phone,
      email,
      permanentAddress,
      rentalAgreementPeriodStart,
      rentalAgreementPeriodEnd,
      priceOrBudget,

      contractDate,
      contractDateStart,
      contractDateEnd,
      payCurrency,
      provideDocument,
      referenceName,
      description,
      userEmail,
    } = req.body;

    const update = await RealEstateOrder.findByIdAndUpdate(
      id,
      {
        serviceName,
      fullName,
      nationality,
      dateOfBirth,
      secureIdentity,
      phone,
      email,
      permanentAddress,
      rentalAgreementPeriodStart,
      rentalAgreementPeriodEnd,
      priceOrBudget,

      contractDate,
      contractDateStart,
      contractDateEnd,
      payCurrency,
      provideDocument,
      referenceName,
      description,
      userEmail,
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        status: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated order",
      data: update,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder,
};
