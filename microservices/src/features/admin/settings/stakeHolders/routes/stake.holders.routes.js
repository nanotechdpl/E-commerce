const express = require("express");
const { addStakeHolder, updateStakeHolder, deleteStakeHolder, getStakeHolders } = require("../controller/stake.holders.controller");
const isAdmin = require("../../../../../middlewares/isAdminMiddleWare");

const stakeHoldersRouter = express.Router();

stakeHoldersRouter.post("/add", isAdmin, addStakeHolder);
stakeHoldersRouter.post("/update", isAdmin, updateStakeHolder);
stakeHoldersRouter.delete("/delete", isAdmin, deleteStakeHolder);
stakeHoldersRouter.get("/get", getStakeHolders);

module.exports = stakeHoldersRouter;