require("dotenv").config();
const axios = require("axios");
const PayHistory = require("../../payment/model/PayHistory");
const { Subscription } = require("../model/subscription.model");
const Agency = require("../../agency/model/agency.model");

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
  const { userId, userEmail } = req.body;

  const subAmount = await Subscription.find({});
  const amount =
    Number(subAmount[0].annualAmount) +
    Number(subAmount[0].securityDepositAmount);

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
              value: String(amount),
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
              return_url: "http://localhost:3000/payment-complete",
              cancel_url: "http://localhost:3000/payment-cancel",
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
      userEmail: userEmail,
      userId: userId,
      tranxId: response.data.id,
      status: "initiate",
      type: "subscription",
      amountDetails: {
        securityDepositAmount: subAmount[0].securityDepositAmount,
        annualAmount: subAmount[0].annualAmount,
      },
    });

    return res.status(200).json({ id: response.data.id });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
    const result = await PayHistory.findOneAndUpdate(
      { tranxId: response.data.id },
      {
        status: response.data.status,
        sellerInfo:
          response?.data?.purchase_units[0]?.payments?.captures[0]
            ?.seller_receivable_breakdown,
      }
    );

    // update user status
    await Agency.findByIdAndUpdate(result?.userId, {
      $set: {
        status: "Active",
      },
    });

    return res.json(response?.data);
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
    const query = {
      type: "subscription",
    };
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
    const query = { userEmail, type: "subscription" };
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
  getPaymentHistory,
};
