const Subscribe = require('../model/subscribe.model');

// Create a new subscription
exports.createSubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscription = await Subscribe.create({ email });
    res.status(201).json(subscription);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email error
      return res.status(400).json({ error: "Email already subscribed" });
    }
    res.status(400).json({ error: error.message });
  }
};

// Get all subscriptions (with optional date filtering)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { from, to } = req.query;
    let filter = {};

    if (from && to) {
      filter.created_at = {
        $gte: new Date(from), // Greater than or equal to "from" date
        $lte: new Date(to),   // Less than or equal to "to" date
      };
    }

    const subscriptions = await Subscribe.find(filter);
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscribe.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a subscription by ID
exports.updateSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    const subscription = await Subscribe.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a subscription by ID
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscribe.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};