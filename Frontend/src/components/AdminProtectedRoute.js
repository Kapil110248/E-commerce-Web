// AdminProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login-admin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
