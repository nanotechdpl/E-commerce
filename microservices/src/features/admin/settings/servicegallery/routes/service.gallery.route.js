const express = require('express');
const { addServiceGallery, updateServiceGallery, deleteServiceGallery,
    getServiceGallery,searchServiceGallery } = require('../controller/service.gallery.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');

const serviceGalleryRouter = express.Router();

serviceGalleryRouter.get('/search', searchServiceGallery);
serviceGalleryRouter.post("/add", isAdmin, addServiceGallery);
serviceGalleryRouter.post("/update", isAdmin, updateServiceGallery);
serviceGalleryRouter.delete("/delete", isAdmin, deleteServiceGallery);
serviceGalleryRouter.get("/get", getServiceGallery);

module.exports = serviceGalleryRouter;