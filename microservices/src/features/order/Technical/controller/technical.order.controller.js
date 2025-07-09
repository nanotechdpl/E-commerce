const technicalOrder = require("../model/technical.order.model");

const createTechnicalOrder = async (req,res) => {
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
        projectType,
        priorityLevel,
        priceOrBudget,
        payCurrency,
        expectedEndDate,
        provideDocument,
        referenceName,
        description,
        userEmail

    } = req.body;
    const requiredFields = [
         "fullName",
        "nationality",
        "dateOfBirth",
        "secureIdentity",
        "phone",
        "email",
        "permanentAddress",
        "projectType",
       "priorityLevel",
        "priceOrBudget",
        "payCurrency",
        "expectedEndDate",
        "userEmail"

    ]

     for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json(
            { 
                message: `Field '${field}' is required`,
                success:false,
                status:400,
         });
      }
    }

    const order = new technicalOrder({
         serviceName,
        fullName,
        nationality,
        dateOfBirth,
        secureIdentity,
        phone,
        email,
        permanentAddress,
        projectType,
        priorityLevel,
        priceOrBudget,
        payCurrency,
        expectedEndDate,
        provideDocument,
        referenceName,
        description,
        userEmail,
        dueAmount: priceOrBudget,
    })

    const savedOrder = await order.save();
    res.status(201).json({
        success: true,
        message: "Technical order created successfully",
        data: savedOrder,
        status: 201,
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Error creating technical order",
        error: error.message,
        status: 500,
    });
   }
    
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await technicalOrder.find();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all technical orders",
      data:orders,
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
}

const getOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await technicalOrder.findById(id);
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
}

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await technicalOrder.findByIdAndDelete(id);
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
}

const updateOrder = async (req,res)=>{
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
        projectType,
        priorityLevel,
        priceOrBudget,
        payCurrency,
        expectedEndDate,
        provideDocument,
        referenceName,
        description,
        userEmail
    } = req.body;

    const update = await technicalOrder.findByIdAndUpdate(
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
        projectType,
        priorityLevel,
        priceOrBudget,
        payCurrency,
        expectedEndDate,
        provideDocument,
        referenceName,
        description,
        userEmail
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
}


module.exports = {
  createTechnicalOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder
};