import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ============================
// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress = {}, paymentMethod = "COD" } = req.body;

    if (!items.length) {
      return res.status(400).json({ message: "No items in order" });
    }

    // 🛒 Fetch products
    const products = await Product.find({
      _id: { $in: items.map((i) => i.productId) },
      isActive: true,
    });

    if (!products.length) {
      return res.status(404).json({ message: "Products not found" });
    }

    let adminId = null;

    const mappedItems = items.map((i) => {
      const p = products.find((pp) => String(pp._id) === String(i.productId));
      if (!p) throw new Error("Invalid product in cart");

      if (!adminId) adminId = p.createdBy;
      return {
        product: p._id,
        name: p.name,
        price: p.price,
        quantity: Number(i.quantity || 1),
      };
    });

    const totalAmount = mappedItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    // ✅ Order create with payment info
    const order = await Order.create({
      user: req.user._id,
      admin: adminId,
      items: mappedItems,
      totalAmount,
      shippingAddress, // phone optional rahega yahan bhi
      paymentInfo: {
        method: paymentMethod === "Online" ? "Online" : "COD",
        txnId: paymentMethod === "Online" ? `TXN-${Date.now()}` : null,
      },
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};



// ============================
// Cancel Order (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res
        .status(400)
        .json({ message: "Delivered orders cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// Admin Orders
// ============================
// My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image price")
      .populate("user", "name email mobile"); // ✅ include mobile

    res.json(orders);
  } catch (err) {
    console.error("Error fetching my orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// Admin Orders
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({ admin: req.user._id })
      .populate("items.product", "name image price")
      .populate("user", "name email mobile") // ✅ include mobile
      .sort("-createdAt");

    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// ============================
// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, admin: req.user._id },
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ============================
// Fix Old Orders (missing names)
export const fixOldOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.name": { $exists: false } });

    for (let order of orders) {
      for (let item of order.items) {
        if (!item.name && item.product) {
          const p = await Product.findById(item.product);
          item.name = p ? p.name : "Unknown Product";
        }
      }
      await order.save();
    }

    res.json({ message: "✅ All old orders fixed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
