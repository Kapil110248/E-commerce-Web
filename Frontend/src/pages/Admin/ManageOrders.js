import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

const statuses = ["Processing", "Shipped", "Delivered"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      let data;

      if (user?.role === "admin") {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getMyOrders();
      }

      setOrders(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    }
  };

  const filtered = orders.filter((o) =>
    filter === "All" ? true : o.status === filter
  );

  return (
    <div className="container py-3">
      <h4 className="mb-3">
        {user?.role === "admin" ? "Manage Orders" : "My Orders"}
      </h4>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex gap-2 align-items-center">
          <span className="text-muted">Filter:</span>
          {["All", "Cancelled", ...statuses].map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${
                filter === s ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
          <span className="ms-auto text-muted">Total: {filtered.length}</span>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3">Loading...</div>
          ) : (
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#Order</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  {user?.role === "admin" && (
                    <th style={{ width: 260 }}>Update</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.user?.name || "-"}</td>

                    {/* ✅ Mobile Number + Call Button */}
                    <td>
                      {o.user?.mobile ? (
                        <>
                          <span>{o.user.mobile}</span>{" "}
                          <a
                            href={`tel:${o.user.mobile}`}
                            className="btn btn-sm "
                          >
                            📞 
                          </a>
                        </>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>

                    {/* ✅ Product Names + Quantity */}
                    <td>
                      {o.items?.map((item, idx) => (
                        <div key={idx}>
                          {item.product?.name || item.name} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>₹{o.totalAmount}</td>

                    {/* ✅ Payment Method */}
                    <td>
                      {o.paymentInfo?.method === "Online" ? (
                        <span className="badge bg-info">Online</span>
                      ) : (
                        <span className="badge bg-secondary">
                          Cash on Delivery
                        </span>
                      )}
                    </td>

                    {/* ✅ Status Badge */}
                    <td>
                      <span
                        className={`badge ${
                          o.status === "Delivered"
                            ? "bg-success"
                            : o.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* ✅ Update Buttons only if Admin & NOT Cancelled */}
                    {user?.role === "admin" && (
                      <td className="d-flex gap-2">
                        {o.status === "Cancelled" ? (
                          <span className="text-muted">Not Editable</span>
                        ) : (
                          statuses.map((s) => (
                            <button
                              key={s}
                              className={`btn btn-sm ${
                                o.status === s
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => updateStatus(o._id, s)}
                            >
                              {s}
                            </button>
                          ))
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={user?.role === "admin" ? "8" : "7"}
                      className="text-center py-4"
                    >
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
