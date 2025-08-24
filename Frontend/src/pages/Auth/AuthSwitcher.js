import React, { useState } from "react";
import CustomerAuth from "./CustomerAuthPage";
import AdminAuth from "./AdminLoginPage";

export default function AuthSwitcher() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">{isAdmin ? "Admin Login" : "Customer Login"}</h4>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            Switch to {isAdmin ? "Customer" : "Admin"}
          </button>
        </div>

        {isAdmin ? <AdminAuth /> : <CustomerAuth />}
      </div>
    </div>
  );
}
