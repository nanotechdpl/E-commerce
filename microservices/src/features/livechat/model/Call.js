const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema(
    {
        caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        callType: { type: String, enum: ["audio", "video"], required: true },
        status: { type: String, enum: ["ongoing", "ended"], default: "ongoing" },
        startTime: { type: Date, default: Date.now },
        endTime: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Call", CallSchema);
