const blogModel = require("../model/blogModel");

const uploadBlog = async (req, res) => {
  try {
    const { title, description, photo, tag } = req.body;

    if (!title || !description || !photo) {
      res.status(400).json({
        title: "Blog Message",
        status: 400,
        tag: "get tag",
        successful: false,
        message:
          "Atleast title, description,price and photo fields are needd to upload blog.",
      });
      return;
    }

    const newBlog = new blogModel({
      title,
      description,
      photo,
      tag,
    });

    await newBlog.save();

    const blogs = await blogModel.find().sort("-1");

    res.status(201).json({
      title: "Blog Message",
      success: true,
      status: 201,
      successful: true,
      message: "Successfully uploaded service.",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      title: "Blog Message",
      status: 500,
      successful: false,
      message: "Internal server error.",
      error: error.message,
    });
    return;
  }
};

const getBlogs = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      blogModel
        .find({
          $or: [{ title: { $regex: query, $options: "i" } }],
        })
        .limit(limit),
      blogModel.countDocuments({
        $or: [{ title: { $regex: query, $options: "i" } }],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

const getBlogsWithPaginationAndSearch = async (req, res) => {
  try {
    let { query = "", limit } = req.query;
    const page = parseInt(req.query.page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const [data, totalData] = await Promise.all([
      blogModel
        .find({
          $or: [{ title: { $regex: query, $options: "i" } }],
        })
        .limit(limit),
      blogModel.countDocuments({
        $or: [{ title: { $regex: query, $options: "i" } }],
      }),
    ]);
    return res.status(200).json({
      data,
      totalData,
      success: true,
      status: 200,
      message: "data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // Get blog ID from request parameters

    if (!id) {
      return res
        .status(400)
        .json({ message: "Blog ID is required", status: 400, success: false });
    }

    const blog = await blogModel.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params; // Get blog ID from request parameters
    const { title, description, photo, tag } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Blog ID is required", status: 400 });
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { title, description, photo, tag },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found", status: 404, success: false });
    }

    res.json({
      message: "Blog updated successfully",
      data: updatedBlog,
      status: 200,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error, status: 500, success: false });
  }
};
const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get blog ID from request parameters
    const { status } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Blog ID is required", status: 400 });
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found", status: 404, success: false });
    }

    res.json({
      message: "Blog status updated successfully",
      data: updatedBlog,
      status: 200,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error, status: 500, success: false });
  }
};

const getSignleBlog = async (req, res) => {
  try {
    const { id } = req.params; // Get blog ID from request parameters

    if (!id) {
      return res
        .status(400)
        .json({ message: "Blog ID is required", status: 400, success: false });
    }

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        status: 404,
        success: false,
      });
    }

    res.json({ 
      data: blog, 
      message: "Blog fetched successfully" ,
      status: 200,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  uploadBlog,
  getBlogs,
  getBlogsWithPaginationAndSearch,
  deleteBlog,
  updateBlog,
  updateBlogStatus,
  getSignleBlog,
};
