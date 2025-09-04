import express from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes need authentication
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", protect, updateCart);
router.delete("/:productId", protect, removeFromCart);

export default router;
