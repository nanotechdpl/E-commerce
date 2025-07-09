const express = require('express');
const { addGlobalOrbit, updateGlobalOrbit, deleteGlobalOrbit, getGlobalOrbit } = require('../controller/global.orbit.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const globalOrbitRouter = express.Router();

globalOrbitRouter.post("/add", isAdmin, addGlobalOrbit);
globalOrbitRouter.post("/update", isAdmin, updateGlobalOrbit);
globalOrbitRouter.delete("/delete", isAdmin, deleteGlobalOrbit);
globalOrbitRouter.get("/get", getGlobalOrbit);

module.exports = globalOrbitRouter;