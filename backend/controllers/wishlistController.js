import User from "../models/User.js";
import Product from "../models/Product.js";

// 📌 Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

// 📌 Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("wishlist");
    res.json(updatedUser.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

// 📌 Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("wishlist");
    res.json(updatedUser.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from wishlist", error: err.message });
  }
};
