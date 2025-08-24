import Cart from "../models/Cart.js"; 
import Product from "../models/Product.js";

// ➕ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // 👈 ensure user mil raha ho (auth middleware se)

    // Product check
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cart find or create
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Item check
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex > -1) {
      // already in cart -> update qty
      cart.items[itemIndex].quantity += quantity;
    } else {
      // add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add cart", error: error.message });
  }
};
// controllers/cartController.js
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.json({ cart: [] }); // agar empty hai
    }

    res.json({ cart: cart.items }); // ✅ sirf items bhejo
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    // Agar user ka cart hi nahi hai
    if (!cart) {
      return res.json({ cart: [] });
    }

    // Item filter out
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({ cart: cart.items }); // ✅ sirf items bhejenge
  } catch (error) {
    console.error("Remove from cart error:", error);
    res
      .status(500)
      .json({ message: "Failed to remove item", error: error.message });
  }
};


// 🗑 Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared", cart: { items: [] } });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
