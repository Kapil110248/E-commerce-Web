import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    mobile: { type: String, default: "", trim: true },

    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isBlocked: { type: Boolean, default: false }, // ✅ block/unblock
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🛒 Cart field (persisted in DB)
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // relation with Product model
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    // 💖 Wishlist field (persisted in DB)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Password hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
