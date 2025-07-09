const express = require("express");
const { sendMessageUser,sendMessageVisitor, getMessages,blockUser,unblockUser } = require("../controller/message.controller");
const router = express.Router();

router.post("/send/user", sendMessageUser); // Send a message for logged in users
router.post("/send/visitor", sendMessageVisitor); // Send a message
router.get("/get", getMessages);  // Retrieve all messages
router.post("/block", blockUser);      // Block a user
router.post("/unblock", unblockUser);


module.exports = router;