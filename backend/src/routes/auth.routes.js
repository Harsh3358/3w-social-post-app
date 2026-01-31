import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("name min 2 chars"),
    body("email").isEmail().withMessage("invalid email"),
    body("password").isLength({ min: 6 }).withMessage("password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already registered" });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = new User({ name, email, password: hashed });
      await user.save();

      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      // don't return password
      const safeUser = { _id: user._id, name: user.name, email: user.email };

      return res.status(201).json({ token, user: safeUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      const safeUser = { _id: user._id, name: user.name, email: user.email };

      return res.json({ token, user: safeUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
