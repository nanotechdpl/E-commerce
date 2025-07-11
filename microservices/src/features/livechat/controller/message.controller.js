const User = require("../../../models/User");
const Message = require("../model/Message");

// Send a new message
exports.sendMessageUser = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        if (!sender) {
            return res.status(400).json({ success: false, message: "Sender (user ID) is required." });
        }

        // Fetch receiver's blocked users list
        const receiverData = await User.findById(receiver);

        // Check if the sender is blocked
        if (receiverData?.blockedUsers?.includes(sender)) {
            return res.status(403).json({ success: false, message: "You are blocked by this user." });
        }

        // Save message
        const form = new Message({ sender, receiver, message });
        const formData = await form.save();

        res.status(201).json({ success: true, formData });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.sendMessageVisitor = async (req, res) => {
    try {
        const { receiver, message } = req.body;
        const visitorId = req.ip; // Use IP address

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required." });
        }

        // Save message
        const form = new Message({ visitorId, receiver, message });
        const formData = await form.save();

        res.status(201).json({ success: true, formData });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Retrieve all messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.query;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { userId, blockUserId } = req.body;

        await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: blockUserId } });

        res.status(200).json({ success: true, message: "User blocked successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const { userId, unblockUserId } = req.body;

        await User.findByIdAndUpdate(userId, { $pull: { blockedUsers: unblockUserId } });

        res.status(200).json({ success: true, message: "User unblocked successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.sendNotification = async (receiver, title, message) => {
    const receiverData = await User.findById(receiver);

    // Don't send notification if the sender is blocked
    if (receiverData.blockedUsers.includes(sender)) {
        return console.log("Notification blocked.");
    }

    // Proceed with notification sending (FCM, OneSignal, etc.)
};