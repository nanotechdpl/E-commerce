const express = require("express");
const { initiateCall_id, endCall_id,blockUser,unblockUser } = require("../controller/call.controller");
const router = express.Router();

router.post("/start", initiateCall_id); // Start a call
router.post("/end", endCall_id);        // End a call
router.post("/block", blockUser);      // Block a user
router.post("/unblock", unblockUser);  


module.exports = router;