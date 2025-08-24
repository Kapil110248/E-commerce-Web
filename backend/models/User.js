import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isBlocked: { type: Boolean, default: false }, // ✅ block/unblock
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 

    // 🛒 Cart field (persisted in DB)
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // relation with Product model
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Password hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
