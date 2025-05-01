import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faHeart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = ({ cart, setCart, wishlist, setWishlist }) => {
  const [actionItemIndex, setActionItemIndex] = useState(null); // Track which item is being acted upon
  const navigate = useNavigate(); // Hook for navigation

  // Remove item from cart
  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index)); // Update cart
    setActionItemIndex(null); // Reset action state
    toast.success("Item removed from the cart!"); // Toast notification
  };

  // Add item to wishlist
  const handleAddToWishlist = (index) => {
    const itemToAdd = cart[index];
    setWishlist((prevWishlist) => [...prevWishlist, itemToAdd]); // Add to wishlist
    setCart(cart.filter((_, i) => i !== index)); // Remove from cart
    setActionItemIndex(null); // Reset action state
    toast.success(`${itemToAdd.title} has been added to your Wishlist!`); // Toast notification
  };

  // Navigate to Product Details on item click
  const handleItemClick = (item) => {
    navigate("/product-details", { state: { product: item } }); // Navigate and pass product details
  };

  // Handle delete icon click
  const handleDeleteClick = (index) => {
    setActionItemIndex(index); // Show action box for the clicked item
  };

  // Handle dismiss (close action box)
  const handleDismissOptions = () => {
    setActionItemIndex(null); // Close the options box
  };

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
          <div className="list-group">
            {cart.map((item, index) => (
              <div
                key={index}
                className="list-group-item mb-3 shadow-sm rounded position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => handleItemClick(item)} // Navigate to Product Details
              >
                <div className="d-flex align-items-center">
                  {/* Product Image */}
                  <img
                    src={
                      item.images?.[0] ||
                      item.thumbnail ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.title}
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
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="mb-1">{item.description}</p>
                    <strong>Price: ₹{item.price * 20}</strong>
                  </div>
                  {/* Black Delete Icon */}
                  <button
                    className="btn ms-auto"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the onClick of the parent
                      handleDeleteClick(index);
                    }}
                    style={{
                      color: "#000", // Black color for the delete icon
                      backgroundColor: "transparent",
                      fontSize: "1.5rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                  {/* Styled Action Box: Remove or Add to Wishlist */}
                  {actionItemIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        backgroundColor: "#f9f9f9", // Light background for better contrast
                        border: "2px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                        zIndex: "1000",
                        padding: "20px",
                        minWidth: "250px", // Increased width for a more spacious design
                      }}
                    >
                      {/* Close (X) Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent click event
                          handleDismissOptions();
                        }}
                        style={{
                          color: "#000", // Black color for the close button
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
                          e.stopPropagation(); // Prevent parent click event
                          handleAddToWishlist(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faHeart} /> Add to Wishlist
                      </button>
                      <button
                        className="btn btn-danger btn-lg w-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent click event
                          handleRemoveFromCart(index);
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
        )}
      </div>
      {/* Toast Notifications */}
   
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
