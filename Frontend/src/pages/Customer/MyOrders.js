import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ✅ Cancel Order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:4000/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update UI instantly
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );

      alert("✅ Order cancelled successfully!");
    } catch (err) {
      console.error("❌ Cancel failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to cancel order!");
    }
  };

  if (!user) {
    return (
      <div className="container py-4">
        <h4>Please login to view your orders.</h4>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-4">
        <h4>Loading your orders...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Orders</h3>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#Order ID</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th> {/* ✅ New Column */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6)}</td>
                    <td>
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="d-flex align-items-center mb-2">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product?.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginRight: "8px",
                              }}
                            />
                          )}
                          <span>
                            {(item.name ||
                              item.product?.name ||
                              "Unnamed Product")}{" "}
                            x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td>₹{order.totalAmount}</td>

                    <td>
                      {order.paymentInfo?.method === "Online" ? (
                        <span className="badge bg-info">Online</span>
                      ) : (
                        <span className="badge bg-secondary">Cash on Delivery</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : order.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                    {/* ✅ Cancel Button */}
                    <td>
                      {order.status !== "Delivered" &&
                      order.status !== "Cancelled" ? (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
