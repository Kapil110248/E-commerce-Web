import User from "../models/User.js";
import Product from "../models/Product.js";

// 🛒 Get Cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if product already in cart
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Already in cart → update quantity
      user.cart[itemIndex].quantity += quantity;
    } else {
      // Not in cart → push new
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📝 Update Quantity
export const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
