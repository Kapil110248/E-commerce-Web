import User from '../models/User.js';

// ✅ Get all users (Admin only)
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }) // Admins ko list se exclude karna hai
      .select("-password")
      .sort("-createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle Block / Unblock User
export const toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ _id: user._id, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Optional: Get my own profile (not all users)
export const getMyUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
