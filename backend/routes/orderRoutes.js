import { Router } from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
  fixOldOrders,
} from "../controllers/orderController.js";

const router = Router();

// Customer Routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);

// Admin Routes
router.get("/admin", protect, requireAdmin, getAdminOrders);
router.patch("/:id/status", protect, requireAdmin, updateOrderStatus);

// 🆕 Temporary Fix Route
router.get("/fix-orders", fixOldOrders);

export default router;
