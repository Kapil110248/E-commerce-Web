// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protect both admin & customer
export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/auth" replace />;

  // If admin tries to open customer route
  if (user.role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If customer tries to open admin route
  if (user.role === "customer" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

// Admin-only route
export const AdminProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
