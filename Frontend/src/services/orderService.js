import api from "./axios";

// ✅ Place a new order (Customer)
const placeOrder = async (orderData) => {
  // orderData ke andar paymentMethod hona chahiye (COD ya Online)
  const { data } = await api.post("/orders", orderData);
  return data;
};

// ✅ Get my orders (Customer)
const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

// ✅ Get all orders (Admin)
const getAllOrders = async () => {
  const { data } = await api.get("/orders/admin");
  return data;
};

// ✅ Update order status (Admin)
const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data;
};

const orderService = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};

export default orderService;
