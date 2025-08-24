// src/services/userService.js
import API from "./axios"; // ✅ custom axios instance

const userService = {
  // 🔹 Admin ke sare users laane ke liye
  getAll: async () => {
    const res = await API.get("/users"); // ✅ all non-admin users
    return res.data;
  },

  // 🔹 Specific user laane ke liye
  getById: async (id) => {
    const res = await API.get(`/users/${id}`);
    return res.data;
  },

  // 🔹 Naya user create karne ke liye
  create: async (data) => {
    const res = await API.post("/users", data);
    return res.data;
  },

  // 🔹 User update karne ke liye
  update: async (id, data) => {
    const res = await API.put(`/users/${id}`, data);
    return res.data;
  },

  // 🔹 User delete karne ke liye
  remove: async (id) => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
  },

  // 🔹 Block / Unblock user
  toggleBlock: async (id) => {
    const res = await API.patch(`/users/${id}/toggle-block`);
    return res.data;
  },
};

export default userService;
