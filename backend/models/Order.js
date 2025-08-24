import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // ✅ Product name
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // 🧑 Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🛠️ Admin (optional: kis seller/admin ka product hai)
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ required hata diya
    },

    // 📦 Ordered Items
    items: [orderItemSchema],

    // 💰 Total
    totalAmount: { type: Number, required: true },

    // 🚚 Status
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    // 💳 Payment Info
    paymentInfo: {
      method: { type: String, default: "COD" },
      txnId: { type: String },
    },

    // 🏠 Shipping Address
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "IN" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
