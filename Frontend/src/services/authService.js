// src/services/authService.js
import API from "./axios";

// ✅ Login (Admin + Customer)
export const loginApi = async (form) => {
  const { data } = await API.post("/auth/login", form);

  // 🔑 Token & User save
  if (data?.token) localStorage.setItem("token", data.token);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
};

// ✅ Register (Only customer allowed)
export const registerApi = async (form) => {
  const { data } = await API.post("/auth/register", form);

  if (data?.token) localStorage.setItem("token", data.token);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
};

// ✅ Get current user (Customer & Admin)
export const getMeApi = async () => {
  try {
    // LocalStorage me already user hai to wahi return karo
    const user = localStorage.getItem("user");
    if (user) return JSON.parse(user);

    // ✅ Backend se fetch karo (correct endpoint `/auth/me`)
    const { data } = await API.get("/auth/me");
    return data;
  } catch (err) {
    console.error("❌ getMeApi failed:", err);
    throw err;
  }
};


// ✅ Logout (Customer + Admin dono ke liye)
export const logoutApi = async () => {
  try {
    await API.post("/auth/logout"); // Cookie clear for customer
  } catch (err) {
    console.warn("Logout API failed, ignoring...", err);
  }

  // 🔑 LocalStorage clear
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
