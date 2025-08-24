import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 👉 Create Product
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    // ✅ Agar file upload hui hai → Cloudinary pe upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // temp file cleanup
    } 
    // ✅ Agar frontend se direct URL aaya hai
    else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const product = await Product.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      image: imageUrl, // 🟢 always string
      createdBy: req.user?._id || undefined,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👉 Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👉 Update Product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Agar new file upload hui hai
    if (req.file) {
      if (product.image) {
        try {
          const publicId = product.image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (delErr) {
          console.warn("Old image delete failed:", delErr.message);
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      product.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    // ✅ Agar direct URL diya gaya hai
    else if (req.body.image) {
      product.image = req.body.image;
    }

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;

    if (req.body.isActive !== undefined) {
      product.isActive = req.body.isActive;
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👉 Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.image) {
      try {
        const publicId = product.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (delErr) {
        console.warn("Image delete failed:", delErr.message);
      }
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
