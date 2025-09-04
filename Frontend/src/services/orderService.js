import api from "./axios";

// Customer - Place new order
const placeOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

// Customer - Get my orders
const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

// Customer - Cancel my order
const cancelOrder = async (orderId) => {
  const { data } = await api.put(`/orders/${orderId}/cancel`);
  return data;
};

// Admin - Get all orders
const getAllOrders = async () => {
  const { data } = await api.get("/orders/admin");
  return data;
};

// Admin - Update order status
const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data;
};

const orderService = {
  placeOrder,
  getMyOrders,
  cancelOrder,      // ✅ Added
  getAllOrders,
  updateOrderStatus,
};

export default orderService;
