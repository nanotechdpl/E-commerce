const express = require('express');
const { addSecurityPage, updateSecurityPage, deleteSecurityPage, getSecurityPages } = require('../controller/security.page.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');


const securityPageRouter =  express.Router()

securityPageRouter.post("/add", isAdmin, addSecurityPage);
securityPageRouter.post("/update", isAdmin, updateSecurityPage);
securityPageRouter.delete("/delete", isAdmin, deleteSecurityPage);
securityPageRouter.get("/get", getSecurityPages);

module.exports = securityPageRouter