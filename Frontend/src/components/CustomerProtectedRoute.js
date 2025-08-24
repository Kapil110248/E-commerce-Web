import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login-customer" replace />;
  }

  if (user.role !== "customer") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
