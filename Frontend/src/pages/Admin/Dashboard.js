import React, { useEffect, useState, useMemo } from "react";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import userService from "../../services/userService";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Correct function names
        const [prodRes, orderRes, userRes] = await Promise.all([
          productService.getAll(),       // productService.js → getAll()
          orderService.getAllOrders(),  // orderService.js → getAllOrders()
          userService.getAll(),         // userService.js → getAll()
        ]);

        setProducts(prodRes || []);
        setOrders(orderRes || []);
        setUsers(userRes || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totals = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
    return {
      products: products.length,
      users: users.length,
      revenue,
      pending: orders.filter((o) => o.status !== "Delivered").length,
    };
  }, [products, users, orders]);

  if (loading) return <div className="text-center py-5">Loading Dashboard...</div>;

  return (
    <div className="container py-3">
      <h3 className="mb-3">Admin Dashboard</h3>

      {/* Stat Cards */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Products</h6>
              <h3>{totals.products}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h3>{totals.users}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Revenue (₹)</h6>
              <h3>{totals.revenue}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Open Orders</h6>
              <h3>{totals.pending}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="row g-3 mt-2">
        {/* Recent Orders */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <strong>Recent Orders</strong>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id}>
                      <td>{o._id.slice(-5)}</td>
                      <td>{o.user?.name || "Unknown"}</td>
                      <td>₹{o.total || o.totalAmount}</td>
                      <td>
                        <span className="badge bg-secondary">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                  {!orders.length && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <strong>Low Stock Products</strong>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((p) => p.stock <= 8)
                    .map((p) => (
                      <tr key={p._id}>
                        <td>{p._id.slice(-5)}</td>
                        <td>{p.name}</td>
                        <td>₹{p.price}</td>
                        <td>{p.stock}</td>
                      </tr>
                    ))}
                  {!products.filter((p) => p.stock <= 8).length && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No low stock products
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
