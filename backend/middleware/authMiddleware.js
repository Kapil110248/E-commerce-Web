import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // ✅ Always prefer Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    console.log("🔑 Raw Token Received:", token); // 👈 Debug log

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // 👈 Debug log

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
    console.error("Auth Middleware Error:", err.message);
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
