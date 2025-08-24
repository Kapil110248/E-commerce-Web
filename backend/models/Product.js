import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ ab optional hai (admin case me issue nahi aayega)
    },
    isActive: { type: Boolean, default: true }, // ✅ Active/Inactive toggle
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
