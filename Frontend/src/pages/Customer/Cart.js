import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import cartService from "../../services/cartService";
import wishlistService from "../../services/wishlistService";
import { useAuth } from "../../context/AuthContext"; // ✅ token lene ke liye

const Cart = ({ wishlist, setWishlist }) => {
  const [cart, setCart] = useState([]);
  const [actionItemIndex, setActionItemIndex] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const token = user?.token;

  // 🛒 Fetch cart from backend on page load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) return;
        const data = await cartService.getCart(token);
        setCart(Array.isArray(data) ? data : data.cart || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart!");
      }
    };
    fetchCart();
  }, [token]);

  // 🗑 Remove item
  const handleRemoveFromCart = async (productId, index) => {
    try {
      if (!token) {
        toast.error("Please login first!");
        return;
      }
      const updated = await cartService.removeFromCart(productId, token);
      setCart(Array.isArray(updated) ? updated : updated.cart || []);
      setActionItemIndex(null);
      toast.success("Item removed from the cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item!");
    }
  };

  // ❤️ Add to wishlist (with backend)
  const handleAddToWishlist = async (item, index) => {
    try {
      if (!token) {
        toast.error("Please login first!");
        return;
      }

      // ✅ Add product to wishlist
      const updated = await wishlistService.addToWishlist(item.product._id, token);
      setWishlist(updated.wishlist || []);

      // ✅ Remove product from cart
      await handleRemoveFromCart(item.product._id, index);

      toast.success(`${item.product?.name} added to Wishlist!`);
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error);
      toast.error("Failed to add to wishlist!");
    }
  };

  // 📄 Product details
  const handleItemClick = (item) => {
    navigate("/product-details", { state: { product: item.product } });
  };

  // 🔢 Grand total
  const grandTotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Your Cart</h1>
        <div className="text-end mb-3">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center">Your cart is empty!</div>
        ) : (
          <>
            <div className="list-group">
              {cart.map((item, index) => (
                <div
                  key={item._id || index}
                  className="list-group-item mb-3 shadow-sm rounded position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/150"}
                      alt={item.product?.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginRight: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 className="fw-bold">{item.product?.name}</h5>
                      <p className="mb-1">{item.product?.category}</p>
                      <p className="mb-1">
                        <strong>Price:</strong> ₹{item.product?.price}
                      </p>
                      <p className="mb-1">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p className="mb-0 text-success fw-bold">
                        Total: ₹{(item.product?.price || 0) * (item.quantity || 1)}
                      </p>
                    </div>

                    {/* Trash Icon */}
                    <button
                      className="btn ms-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionItemIndex(index);
                      }}
                      style={{
                        color: "#000",
                        backgroundColor: "transparent",
                        fontSize: "1.5rem",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>

                    {/* Action Box */}
                    {actionItemIndex === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: "0",
                          backgroundColor: "#f9f9f9",
                          border: "2px solid #ddd",
                          borderRadius: "10px",
                          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                          zIndex: "1000",
                          padding: "20px",
                          minWidth: "250px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionItemIndex(null);
                          }}
                          style={{
                            color: "#000",
                            backgroundColor: "transparent",
                            fontSize: "1.2rem",
                            border: "none",
                            cursor: "pointer",
                            position: "absolute",
                            top: "10px",
                            right: "15px",
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <p className="text-center mb-4 fw-bold">
                          What would you like to do?
                        </p>
                        <button
                          className="btn btn-warning btn-lg w-100 mb-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(item, index);
                          }}
                        >
                          <FontAwesomeIcon icon={faHeart} /> Add to Wishlist
                        </button>
                        <button
                          className="btn btn-danger btn-lg w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromCart(item.product._id, index);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-end mt-4">
              <h4 className="fw-bold">Grand Total: ₹{grandTotal}</h4>
            </div>
          </>
        )}
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
        theme="dark"
      />
    </div>
  );
};

export default Cart;
