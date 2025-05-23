const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user.userId };
    if (status) query.status = status;
    const blogs = await Blog.find(query).sort({ updatedAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error in GET /blogs:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/draft", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blog = new Blog({
      title,
      content,
      tags,
      status: "Draft",
      userId: req.user.userId,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/publish", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blog = new Blog({
      title,
      content,
      tags,
      status: "Published",
      userId: req.user.userId,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
