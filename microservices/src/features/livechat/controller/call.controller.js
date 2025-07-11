const User = require("../../../models/User");
const Call = require("../model/Call");

// Initiate a new call
exports.initiateCall_id = async (req, res) => {
    try {
        const { caller, receiver, callType } = req.body; // callType: 'audio' or 'video'
                // Fetch receiver's blocked users list
                const receiverData = await User.findById(receiver);

                // Check if caller is in receiver's blocked list
                if (receiverData.blockedUsers.includes(caller)) {
                    return res.status(403).json({ success: false, message: "You are blocked by this user." });
                }
        
        const call = new Call({ caller, receiver, callType, status: "ongoing" });
        await call.save();
        res.status(201).json({ success: true, call });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// End a call
exports.endCall_id = async (req, res) => {
    try {
        const { callId } = req.body;
        const call = await Call.findByIdAndUpdate(callId, { status: "ended" }, { new: true });
        if (!call) return res.status(404).json({ success: false, message: "Call not found" });

        res.status(200).json({ success: true, call });
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
