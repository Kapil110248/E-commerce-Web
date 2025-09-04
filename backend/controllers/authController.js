import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ✅ Generate JWT
const signToken = (id, role) => {
  const payload = role === "admin" ? { role: "admin" } : { id, role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Set cookie
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ✅ REGISTER (only customers)
export const register = async (req, res) => {
  try {
    console.log("📩 REGISTER BODY:", req.body);

    const { name, email, password, mobile = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // ✅ pre-save hook se hash ho jayega
      mobile,
      role: "customer",
    });

    console.log("✅ User registered:", user.email);

    const token = signToken(user._id, "customer");
    setCookie(res, token);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN (admin + customer)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 🔒 Admin Login
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = signToken(null, "admin"); // ✅ id ki zarurat nahi
        setCookie(res, token);

        return res.json({
          message: "Admin login successful",
          token,
          user: {
            name: "Super Admin",
            email: process.env.ADMIN_EMAIL,
            role: "admin",
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }
    }

    // 👇 Customer Login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.role !== "customer")
      return res.status(400).json({ message: "Only customers can login here" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id, "customer");
    setCookie(res, token);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGOUT
export const logout = async (_req, res) => {
  res.clearCookie("token", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",  
  });
  res.json({ message: "Logged out" });
};

// ✅ GET ME
export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id || null,
    name: req.user.name,
    email: req.user.email,
    mobile: req.user.mobile,
    role: req.user.role,
  });
};
