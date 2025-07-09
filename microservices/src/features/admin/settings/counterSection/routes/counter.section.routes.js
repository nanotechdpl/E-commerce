const express = require("express");
const { getCounterSection } = require("../controller/counter.section.controller");

const counterSectionRouter = express.Router();

counterSectionRouter.get("/", getCounterSection);

module.exports = counterSectionRouter;