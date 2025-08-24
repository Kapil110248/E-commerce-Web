import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// customer register
router.post("/register", register);

// login (auto check → admin or customer)
router.post("/login", login);

// logout
router.post("/logout", logout);

// get current user
router.get("/me", protect, getMe);

export default router;
