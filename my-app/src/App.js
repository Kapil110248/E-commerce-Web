import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Categories from "./pages/Categorize";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";

import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategorizePage";

function App() {
  // State Management
  const [cart, setCart] = useState([]); // State for cart items
  const [wishlist, setWishlist] = useState([]); // State for wishlist items
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Add to Wishlist Functionality from Cart
  const handleAddToWishlist = (item) => {
    // Add item to wishlist if it isn't already in the wishlist
    if (!wishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
      setWishlist((prevWishlist) => [...prevWishlist, item]);
    }
    // Remove item from cart after adding to wishlist
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== item.id)
    );
  };

  return (
    <Router>
      {/* Navbar */}
      <Navbar
        cart={cart}
        wishlist={wishlist}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              searchQuery={searchQuery}
            />
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
              handleAddToWishlist={handleAddToWishlist} // Add handler
            />
          }
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/profile" element={<Login />} />
        <Route
          path="/product-details"
          element={<ProductDetails cart={cart} setCart={setCart} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
