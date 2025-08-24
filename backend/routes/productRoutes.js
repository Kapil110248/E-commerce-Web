import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer storage (temporary save before Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get file extension
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getProducts);

router.post("/", protect, requireAdmin, upload.single("image"), createProduct);

router.put("/:id", protect, requireAdmin, upload.single("image"), updateProduct);

router.delete("/:id", protect, requireAdmin, deleteProduct);

export default router;
