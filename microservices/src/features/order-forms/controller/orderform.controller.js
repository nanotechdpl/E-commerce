const express = require("express");
const OrderForm = require("../model/orderform.model");

// Create a new order
const createOrder = async (req, res) => {
  try {
    //const userId = req.user ? req.user.id : null; // Extract userId from middleware
   // console.log(req.user)
    const {
      orderCreatorId,
      fullName,
      email,
      phoneNumber,
      amount,
      dueAmount,
      category,
      referrenceName,
      documents,
      description,
    } = req.body;
    let additionalFields = {};

    console.log("req.body:", req.body);

    console.log("Category-Tec-Con:", category);
    if (!fullName || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "fullName, email and phoneNumber are required." });
    }
    // Validation for category-specific required fields
    switch (category) {
      case "Technical":
      case "Construction":
        console.log("Category-Tec-Con:", category);
        if (!req.body.requirements || !req.body.type) {
          return res
            .status(400)
            .json({ error: "requirements and type are required." });
        }
        additionalFields = {
          requirements: req.body.requirements,
          type: req.body.type,
        };
        break;
      case "Hiring":
        console.log("Category-Hir:", category);
        if (
          !req.body.employeeLocation ||
          !req.body.location ||
          !req.body.hiringPeriod ||
          !req.body.employeeNo
        ) {
          return res.status(400).json({
            error:
              "EmployeeLocation, Location, HiringPeriod and employeeNo are required.",
          });
        }
        additionalFields = {
          employeeLocation: req.body.employeeLocation,
          location: req.body.location,
          hiringPeriod: req.body.hiringPeriod,
          employeeNo: req.body.employeeNo,
        };
        break;
      case "Export":
        if (
          !req.body.shippingMethod ||
          !req.body.quantity ||
          !req.body.address
        ) {
          return res.status(400).json({
            error: "Shipping method, quantity, and address are required.",
          });
        }
        additionalFields = {
          shippingMethod: req.body.shippingMethod,
          quantity: req.body.quantity,
          address: req.body.address,
        };
        break;
      case "Visa":
        if (
          !req.body.nationality ||
          !req.body.passportNumber ||
          !req.body.visaType ||
          !req.body.departureDate
        ) {
          return res.status(400).json({
            error:
              "Nationality, passport number, departure date and visa type are required.",
          });
        }
        additionalFields = {
          nationality: req.body.nationality,
          passportNumber: req.body.passportNumber,
          visaType: req.body.visaType,
          departureDate: req.body.departureDate,
        };
        break;
      case "Traveling":
        if (
          !req.body.passportNumber ||
          !req.body.visaType ||
          !req.body.departureDate ||
          !req.body.destination ||
          !req.body.returnDate
        ) {
          return res.status(400).json({
            error:
              "Departure date, passport number, destination, return date and visa type are required.",
          });
        }
        additionalFields = {
          passportNumber: req.body.passportNumber,
          visaType: req.body.visaType,
          departureDate: req.body.departureDate,
          returnDate: req.body.returnDate,
          destination: req.body.destination,
        };
        break;
      case "Real Estate":
        if (
          !req.body.propertyType ||
          !req.body.propertyStatus ||
          !req.body.propertyAddress
        ) {
          return res.status(400).json({
            error:
              "Property type, Property status and Property address are required.",
          });
        }
        additionalFields = {
          propertyType: req.body.propertyType,
          propertyStatus: req.body.propertyStatus,
          propertyAddress: req.body.propertyAddress,
        };
        break;
      case "Business":
        if (
          !req.body.meetingLocation ||
          !req.body.meetingType ||
          !req.body.duration || 
          !req.body.schedule
        ) {
          return res.status(400).json({
            error:
              "Meeting location, Meeting type, Duration, and schedule are required.",
          });
        }
        additionalFields = {
          meetingLocation: req.body.meetingLocation,
          meetingType: req.body.meetingType,
          duration: req.body.duration,
          schedule: req.body.schedule,
        };
        break;
        case "Other":
        if (
          !req.body.address
        ) {
          return res.status(400).json({
            error:
              "Address is required.",
          });
        }
        additionalFields = {
          address: req.body.address
        };
        break;
    }

    // Create new order
    const order = new OrderForm({
      orderCreatorId,
      fullName,
      email,
      phoneNumber,
      referrenceName,
      documents,
      description,
      category,
      amount,
      dueAmount,
      ...additionalFields,
    });
     await order.save();
    // // res.status(201).json(order);
    return res.status(201).json({
      title: "Order creation Message",
      status: 200,
      message: "Order creation successful",
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { orderCreatorId } = req.query;
    const query = orderCreatorId ? { orderCreatorId } : {};
    // const userId = req.user ? req.user.id : null;
    // if (!userId) return res.status(400).json({ error: "User ID is required." });
    // const orders = await OrderForm.find({ userId });
    const orders = await OrderForm.find(query);
    // res.status(200).json(orders);
    res.status(200).json({
      title: "Order Message",
      status: 200,
      message: "Order get successful",
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderForm.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    let additionalFields = {};

    if (!category) {
      return res
        .status(400)
        .json({ error: "Category is required." });
    }

    const existingOrder = await OrderForm.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Check if the order status is "Pending"
    // if (existingOrder.status !== "Pending") {
    //   return res.status(400).json({
    //     error: "Order cannot be updated as it is not in Pending status.",
    //   });
    // }
    // Validation for category-specific required fields
    switch (category) {
      case "Technical":
      case "Construction":
        console.log("Category-Tec-Con:", category);
        if (!req.body.requirements || !req.body.type) {
          return res
            .status(400)
            .json({ error: "Requirements and type are required." });
        }
        additionalFields = {
          requirements: req.body.requirements,
          type: req.body.type,
        };
        break;
      case "Hiring":
        console.log("Category-Hir:", category);
        if (
          !req.body.employeeLocation ||
          !req.body.location ||
          !req.body.hiringPeriod ||
          !req.body.employeeNo
        ) {
          return res.status(400).json({
            error:
              "EmployeeLocation, Location, HiringPeriod and employeeNo are required.",
          });
        }
        additionalFields = {
          employeeLocation: req.body.employeeLocation,
          location: req.body.location,
          hiringPeriod: req.body.hiringPeriod,
          employeeNo: req.body.employeeNo,
        };
        break;
      case "Export":
        if (
          !req.body.shippingMethod ||
          !req.body.quantity ||
          !req.body.address
        ) {
          return res.status(400).json({
            error: "Shipping method, quantity, and address are required.",
          });
        }
        additionalFields = {
          shippingMethod: req.body.shippingMethod,
          quantity: req.body.quantity,
          address: req.body.address,
        };
        break;
      case "Visa":
        if (
          !req.body.nationality ||
          !req.body.passportNumber ||
          !req.body.visaType ||
          !req.body.departureDate
        ) {
          return res.status(400).json({
            error:
              "Nationality, passport number, departure date and visa type are required.",
          });
        }
        additionalFields = {
          nationality: req.body.nationality,
          passportNumber: req.body.passportNumber,
          visaType: req.body.visaType,
          departureDate: req.body.departureDate,
        };
        break;
      case "Traveling":
        if (
          !req.body.passportNumber ||
          !req.body.visaType ||
          !req.body.departureDate ||
          !req.body.destination ||
          !req.body.returnDate
        ) {
          return res.status(400).json({
            error:
              "Departure date, passport number, destination, return date and visa type are required.",
          });
        }
        additionalFields = {
          passportNumber: req.body.passportNumber,
          visaType: req.body.visaType,
          departureDate: req.body.departureDate,
          returnDate: req.body.returnDate,
          destination: req.body.destination,
        };
        break;
      case "Real Estate":
        if (
          !req.body.propertyType ||
          !req.body.propertyStatus ||
          !req.body.propertyAddress
        ) {
          return res.status(400).json({
            error:
              "Property type, Property status and Property address are required.",
          });
        }
        additionalFields = {
          propertyType: req.body.propertyType,
          propertyStatus: req.body.propertyStatus,
          propertyAddress: req.body.propertyAddress,
        };
        break;
      case "Business":
        if (
          !req.body.meetingLocation ||
          !req.body.meetingType ||
          !req.body.duration ||
          !req.body.schedule
        ) {
          return res.status(400).json({
            error:
              "Meeting location, Meeting type, Duration, and schedule are required.",
          });
        }
        additionalFields = {
          meetingLocation: req.body.meetingLocation,
          meetingType: req.body.meetingType,
          duration: req.body.duration,
          schedule: req.body.schedule,
        };
        break;
      case "Other":
        if (!req.body.address) {
          return res.status(400).json({
            error: "Address is required.",
          });
        }
        additionalFields = {
          address: req.body.address,
        };
        break;
    }

    const order = await OrderForm.findByIdAndUpdate(
      id,
      { ...req.body, ...additionalFields },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderForm.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
