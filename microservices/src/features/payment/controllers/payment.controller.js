require("dotenv").config();
const axios = require("axios");
const PayHistory = require("../model/PayHistory");

const TechnicalOrder = require("../../order/Technical/model/technical.order.model");
const ConstructionOrder = require("../../order/construction/model/construction.order.model");
const RealEstateOrder = require("../../order/realEstate/model/realEstate.order.model");
const BusinessOrder = require("../../order/business/model/business.order.model");
const EmployeeHiringOrder = require("../../order/employeeHiring/model/employeeHiring.order.model");
const InputExportOrder = require("../../order/InputExport/model/inputExport.order.model");
const VisaTravellingOrder = require("../../order/visa-travelling/model/visaTravelling.order.model");

const BASE_URL = process.env.PAYPAL_API;
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_CLIENT_SECRET;

const getAccessToken = async () => {
  try {
    const response = await axios({
      url: `${BASE_URL}/v1/oauth2/token`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: CLIENT,
        password: SECRET,
      },
      data: "grant_type=client_credentials",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Access Token Error:", error.response?.data || error.message);
    throw new Error("Unable to get PayPal access token");
  }
};

async function createPayment(req, res) {
  const { amount, orderCustomId, orderId, due, userEmail } = req.body;

  if (!amount) {
    return res.status(400).json({
      message: "Amount is required",
      example: {
        amount: 100,
      },
    });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "My Company",
              locale: "en-US",
              user_action: "PAY_NOW",
              return_url: "http://localhost:5173/payment-complete",
              cancel_url: "http://localhost:5173/payment-cancel",
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    await PayHistory.create({
      amount: amount,
      orderId: orderId,
      orderCustomId: orderCustomId,
      userEmail: userEmail,
      tranxId: response.data.id,
      status: "initiate",
    });

    return res.status(200).json({ id: response.data.id });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// order update
async function orderUpdate(orderId) {
  try {
    const orders = [
      await TechnicalOrder.findOne({
        orderId: orderId,
      }),
      await ConstructionOrder.findOne({
        orderId: orderId,
      }),
      await RealEstateOrder.findOne({
        orderId: orderId,
      }),
      await BusinessOrder.findOne({
        orderId: orderId,
      }),
      await EmployeeHiringOrder.findOne({
        orderId: orderId,
      }),
      await InputExportOrder.findOne({
        orderId: orderId,
      }),
      await VisaTravellingOrder.findOne({
        orderId: orderId,
      }),
    ];

    const sanitizedData = orders
      ?.filter((item) => item != null)
      .map((item) => {
        item.orderStatus = "waiting";
        //TODO: up order amount , order due amount
        item.save();
        return item;
      });

    return sanitizedData;
  } catch (error) {
    console.error("<<<--- order update failed --->>>", error?.message);
  }
}

async function captureOrder(req, res) {
  const { orderID } = req.body;

  if (!orderID)
    return res.status(400).json({
      message: "Order ID is required",
      example: {
        orderID: "43702876YM0588433",
      },
    });
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // update payment history
    const updateHistory = await PayHistory.findOneAndUpdate(
      { tranxId: response.data.id },
      {
        status: response.data.status,
        sellerInfo:
          response?.data?.purchase_units[0]?.payments?.captures[0]
            ?.seller_receivable_breakdown,
      }
    );

    // update order status and amount
    await orderUpdate(updateHistory.orderCustomId);

    res.json(response?.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getPaymentHistory(req, res) {
  const { page = 1, limit = 10, status, startDate, endDate } = req.query;
  try {
    // Build query filters
    const query = {};
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sort by newest first
      select: "-__v", // Exclude version key
      lean: true, // Return plain JavaScript objects instead of Mongoose documents
      customLabels: {
        docs: "payments",
        totalDocs: "totalPayments",
      },
    };

    const paymentHistory = await PayHistory.paginate(query, options);

    res.json({
      ...paymentHistory,
      example: {
        page: 1,
        limit: 10,
        status: "COMPLETED",
        startDate: "2025-06-16",
        endDate: "2025-06-16",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
      error: error.message,
    });
  }
}

async function getUserPaymentHistory(req, res) {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    userEmail,
  } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      message: "User email is required",
      example: {
        userEmail: "loggedInUserEmail@gmail.com",
      },
    });
  }
  try {
    const query = { userEmail };
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      select: "-__v -sellerInfo -charge",
      lean: true,
      customLabels: {
        docs: "payments",
        totalDocs: "totalPayments",
      },
    };

    const paymentHistory = await PayHistory.paginate(query, options);

    res.json({
      ...paymentHistory,
      example: {
        page: 1,
        limit: 10,
        status: "COMPLETED",
        startDate: "2025-06-16",
        endDate: "2025-06-16",
        userEmail: "EMAIL",
      },
    });
  } catch (error) {}
}

module.exports = {
  createPayment,
  captureOrder,
  getPaymentHistory,
  getUserPaymentHistory,
};

const payment_completed = {
  id: "8G648200KP9571920",
  status: "COMPLETED",
  payment_source: {
    paypal: {
      email_address: "sb-6plsp43316668@personal.example.com",
      account_id: "LPNLEG26MFHHJ",
      account_status: "VERIFIED",
      name: {
        given_name: "John",
        surname: "Doe",
      },
      address: {
        country_code: "CO",
      },
    },
  },
  purchase_units: [
    {
      reference_id: "default",
      shipping: {
        name: {
          full_name: "John Doe",
        },
        address: {
          address_line_1: "Free Trade Zone",
          admin_area_2: "Bogota",
          admin_area_1: "Bogota",
          postal_code: "110111",
          country_code: "CO",
        },
      },
      payments: {
        captures: [
          {
            id: "3M838411NG1012506",
            status: "COMPLETED",
            amount: {
              currency_code: "USD",
              value: "10.00",
            },
            final_capture: true,
            seller_protection: {
              status: "ELIGIBLE",
              dispute_categories: [
                "ITEM_NOT_RECEIVED",
                "UNAUTHORIZED_TRANSACTION",
              ],
            },
            seller_receivable_breakdown: {
              gross_amount: {
                currency_code: "USD",
                value: "10.00",
              },
              paypal_fee: {
                currency_code: "USD",
                value: "0.84",
              },
              net_amount: {
                currency_code: "USD",
                value: "9.16",
              },
            },
            links: [
              {
                href: "https://api.sandbox.paypal.com/v2/payments/captures/3M838411NG1012506",
                rel: "self",
                method: "GET",
              },
              {
                href: "https://api.sandbox.paypal.com/v2/payments/captures/3M838411NG1012506/refund",
                rel: "refund",
                method: "POST",
              },
              {
                href: "https://api.sandbox.paypal.com/v2/checkout/orders/8G648200KP9571920",
                rel: "up",
                method: "GET",
              },
            ],
            create_time: "2025-06-09T11:39:33Z",
            update_time: "2025-06-09T11:39:33Z",
          },
        ],
      },
    },
  ],
  payer: {
    name: {
      given_name: "John",
      surname: "Doe",
    },
    email_address: "sb-6plsp43316668@personal.example.com",
    payer_id: "LPNLEG26MFHHJ",
    address: {
      country_code: "CO",
    },
  },
  links: [
    {
      href: "https://api.sandbox.paypal.com/v2/checkout/orders/8G648200KP9571920",
      rel: "self",
      method: "GET",
    },
  ],
};

const seller_info =
  payment_completed.purchase_units[0].payments.captures[0]
    .seller_receivable_breakdown;
