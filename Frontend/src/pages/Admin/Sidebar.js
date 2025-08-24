import React from "react";

const Sidebar = ({ setActiveTab }) => {
  return (
    <div style={{ width: "200px", background: "#222", color: "#fff", height: "100vh" }}>
      <h3 style={{ padding: "10px" }}>Admin Panel</h3>
      <div onClick={() => setActiveTab("products")} style={{ padding: "10px", cursor: "pointer" }}>
        Manage Products
      </div>
      <div onClick={() => setActiveTab("users")} style={{ padding: "10px", cursor: "pointer" }}>
        Manage Users
      </div>
      <div onClick={() => setActiveTab("orders")} style={{ padding: "10px", cursor: "pointer" }}>
        Manage Orders
      </div>
    </div>
  );
};

export default Sidebar;
