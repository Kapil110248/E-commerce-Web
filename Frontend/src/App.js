import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Routes
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";

// Navbars
import Navbar from "./pages/Customer/Navbar";
import AdminNavbar from "./pages/Admin/Navbar";

// Customer pages
import Home from "./pages/Customer/Home";
import Cart from "./pages/Customer/Cart";
import Categories from "./pages/Customer/Categorize";
import Wishlist from "./pages/Customer/Wishlist";
import ProductDetails from "./pages/Customer/ProductDetails";
import CategoryPage from "./pages/Customer/CategorizePage";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import MyOrders from "./pages/Customer/MyOrders";

// Auth pages
import AdminAuth from "./pages/Auth/AdminLoginPage";
import CustomerAuth from "./pages/Auth/CustomerAuthPage";
import AuthSwitcher from "./pages/Auth/AuthSwitcher";

// Admin pages
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageOrders from "./pages/Admin/ManageOrders";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProfile from "./pages/Admin/AdminProfile";

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ Customer states
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToWishlist = (item) => {
    if (!wishlist.some((wishlistItem) => wishlistItem._id === item._id)) {
      setWishlist((prevWishlist) => [...prevWishlist, item]);
    }
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem._id !== item._id)
    );
  };

  // ✅ Check if route is admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Navbar Logic */}
      {isAdminRoute ? (
        user?.role === "admin" && <AdminNavbar />
      ) : (
        user?.role !== "admin" && (
          <Navbar
            cart={cart}
            wishlist={wishlist}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        )
      )}

      <Routes>
        {/* ✅ Public Customer Routes */}
        <Route
          path="/"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Home
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                searchQuery={searchQuery}
              />
            )
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              handleAddToWishlist={handleAddToWishlist}
            />
          }
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* ✅ user pass for Buy Now */}
        <Route
          path="/product-details"
          element={
            <ProductDetails cart={cart} setCart={setCart} user={user} />
          }
        />

        {/* ✅ Auth Routes */}
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin/dashboard" : "/profile"}
                replace
              />
            ) : (
              <AuthSwitcher />
            )
          }
        />
        <Route
          path="/login-customer"
          element={user ? <Navigate to="/profile" replace /> : <CustomerAuth />}
        />
        <Route
          path="/login-admin"
          element={user ? <Navigate to="/admin/dashboard" replace /> : <AdminAuth />}
        />

        {/* ✅ Customer Protected Routes */}
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* ✅ Admin Protected Routes */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* ✅ Default Redirect */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin/dashboard" : "/profile"}
                replace
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
