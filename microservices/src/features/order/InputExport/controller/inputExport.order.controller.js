const InputExportOrder = require("../model/inputExport.order.model");

const createOrder = async (req,res) => {
   try {
     const {
        serviceName,
        shippingMethod,
        quantity,
        weight,
        shippingAddress,
         priceOrBudget,
        payCurrency,
        fullName,
        nationality,
        dateOfBirth,
        secureIdentity,
        phone,
        email,
        permanentAddress,
       
        referenceName,
        provideDocument,
        description,
        userEmail

    } = req.body;
    const requiredFields = [
        " serviceName",
        "shippingMethod",
        "quantity",
        "weight",
        "shippingAddress",
         "priceOrBudget",
        "payCurrency",
        "fullName",
        "nationality",
        "dateOfBirth",
        "secureIdentity",
        "phone",
        "email",
        "permanentAddress",
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

    const order = new InputExportOrder({
         serviceName,
        shippingMethod,
        quantity,
        weight,
        shippingAddress,
         priceOrBudget,
        payCurrency,
        fullName,
        nationality,
        dateOfBirth,
        secureIdentity,
        phone,
        email,
        permanentAddress,
       
        referenceName,
        provideDocument,
        description,
        userEmail,
        dueAmount: priceOrBudget,
    })

    const savedOrder = await order.save();
    res.status(201).json({
        success: true,
        message: "Input Export order created successfully",
        data: savedOrder,
        status: 201,
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Error creating Business order",
        error: error.message,
        status: 500,
    });
   }
    
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await InputExportOrder.find();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all Input Export orders",
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
    const order = await InputExportOrder.findById(id);
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
    const deletedOrder = await InputExportOrder.findByIdAndDelete(id);
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
        shippingMethod,
        quantity,
        weight,
        shippingAddress,
         priceOrBudget,
        payCurrency,
        fullName,
        nationality,
        dateOfBirth,
        secureIdentity,
        phone,
        email,
        permanentAddress,
       
        referenceName,
        provideDocument,
        description,
        userEmail
    } = req.body;

    const update = await InputExportOrder.findByIdAndUpdate(
        id,
        {
         serviceName,
        shippingMethod,
        quantity,
        weight,
        shippingAddress,
         priceOrBudget,
        payCurrency,
        fullName,
        nationality,
        dateOfBirth,
        secureIdentity,
        phone,
        email,
        permanentAddress,
       
        referenceName,
        provideDocument,
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
  createOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder
};