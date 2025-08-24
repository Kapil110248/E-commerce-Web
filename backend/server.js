// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import connectDB from "./config/db.js";

// Models
import User from "./models/User.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

// ✅ Security Middlewares
app.use(helmet()); // set security headers
app.use(xss()); // prevent XSS attacks
app.use(
  mongoSanitize({
    replaceWith: "_", // prevent query injection error in express v5
  })
);

// ✅ Body Parsers
app.use(express.json());
app.use(cookieParser());

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:3000", // frontend ka URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 4000;

// ✅ Start server after DB connection
connectDB().then(async () => {
  console.log("📡 Database connected, starting server...");

  // 🛑 Ensure Default Admin Exists
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Default Admin created:", admin.email);
  } else {
    console.log("✅ Admin already exists:", admin.email);
  }

  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
