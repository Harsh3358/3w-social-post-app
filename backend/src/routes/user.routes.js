import express from "express";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/user/me
router.get("/me", auth, (req, res) => {
  // auth middleware attached the user
  return res.json({ user: req.user });
});

export default router;
