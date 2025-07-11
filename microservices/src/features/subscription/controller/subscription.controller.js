const { Subscription } = require("../model/subscription.model");

const getSubscriptionFee = async (req, res) => {
  try {
    const subscriptionFee = await Subscription.find();
    return res.status(200).json({
      success: true,
      data: subscriptionFee,
    });
  } catch (error) {
    console.error("🚀 ~ getSubscriptionFee ~ error:", error?.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubscriptionFee,
};
