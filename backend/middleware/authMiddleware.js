import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ If Admin
    if (decoded.role === "admin") {
      req.user = {
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };
      return next();
    }

    // ✅ Otherwise Customer
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin only route" });
  }
};
