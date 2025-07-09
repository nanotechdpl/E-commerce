const mongoose = require("mongoose");

const UserLivechatSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Store blocked user IDs
});

module.exports = mongoose.model("UserLivechat", UserLivechatSchema);
