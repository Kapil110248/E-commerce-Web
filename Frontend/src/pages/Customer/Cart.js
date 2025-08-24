import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import cartService from "../../services/cartService";

const Cart = ({ wishlist, setWishlist }) => {
  const [cart, setCart] = useState([]);
  const [actionItemIndex, setActionItemIndex] = useState(null);
  const navigate = useNavigate();

  // 🛒 Fetch cart from backend on page load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();

        console.log("Fetched cart data:", data);

        if (Array.isArray(data.cart)) {
          setCart(data.cart);
        } else if (data.cart?.items && Array.isArray(data.cart.items)) {
          setCart(data.cart.items);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart!");
      }
    };
    fetchCart();
  }, []);

  // 🗑 Remove item from cart
  const handleRemoveFromCart = async (productId, index) => {
    try {
      const updated = await cartService.removeFromCart(productId);
      console.log("Updated Cart after remove:", updated);
      setCart(updated.cart || []);
      setActionItemIndex(null);
      toast.success("Item removed from the cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item!");
    }
  };

  // ❤️ Add item to wishlist
  const handleAddToWishlist = (item, index) => {
    setWishlist((prevWishlist) => [...prevWishlist, item]);
    setCart(cart.filter((_, i) => i !== index));
    setActionItemIndex(null);
    toast.success(`${item.product?.name} has been added to your Wishlist!`);
  };

  // 📄 Navigate to Product Details
  const handleItemClick = (item) => {
    navigate("/product-details", { state: { product: item.product } });
  };

  // 🔢 Calculate grand total
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
                    {/* Product Image */}
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

                    {/* Delete Icon */}
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
                        {/* Close */}
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

            {/* 🧾 Grand Total */}
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
