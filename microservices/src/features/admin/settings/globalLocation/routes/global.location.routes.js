const express = require("express");
const globalLocationController = require("../controller/global.location.controller");
const isAdmin = require("../../../../../middlewares/isAdminMiddleWare");
const globalLocationRouter = express.Router();

globalLocationRouter.get('/search', globalLocationController.searchGlobalLocations);
globalLocationRouter.post("/", isAdmin, globalLocationController.createLocation);
globalLocationRouter.get("/", globalLocationController.getAllLocations);
globalLocationRouter.get("/:id", globalLocationController.getLocationById);
globalLocationRouter.put("/:id", isAdmin, globalLocationController.updateLocation);
globalLocationRouter.put("/status/:id", isAdmin, globalLocationController.changeBranchStatus);
globalLocationRouter.delete("/:id", isAdmin, globalLocationController.deleteLocation);

module.exports = globalLocationRouter;