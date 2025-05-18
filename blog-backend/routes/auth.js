// Authentication routes
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({ token, user: { email, name } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    res.json({ token, user: { email, name: user.name } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
