const express = require("express");
const {
  uploadBlog,
  getBlogs,
  deleteBlog,
  updateBlog,
  updateBlogStatus,
  getSignleBlog

} = require("../controller/blogController");
const isAdmin = require("../../../middlewares/isAdminMiddleWare");
const blogRouter = express.Router();

blogRouter.post("/", uploadBlog);

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getSignleBlog); // Assuming this is for getting all blogs


blogRouter.delete("/", deleteBlog);

blogRouter.put("/:id", updateBlog);
blogRouter.put("/status/:id", updateBlogStatus);

module.exports = blogRouter;
