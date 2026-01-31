import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "No token, auth denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Invalid token" });
    next();
  } catch (err) {
    console.error("auth middleware error", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
}
