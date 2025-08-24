import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Wishlist = ({ wishlist, setWishlist }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Navigate to Product Details
  const handleItemClick = (item) => {
    navigate("/product-details", { state: { product: item } }); // Pass product details
  };

  // Show confirmation modal for removing an item
  const handleRemoveClick = (index) => {
    setItemToRemove(index);
    setShowModal(true);
  };

  // Confirm removal of an item
  const confirmRemove = () => {
    const removedItem = wishlist[itemToRemove];
    setWishlist(wishlist.filter((_, index) => index !== itemToRemove));
    setShowModal(false);
    console.log(`${removedItem.title} removed from Wishlist!`);
  };

  // Cancel removal action
  const cancelRemove = () => {
    setShowModal(false);
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Your Wishlist</h1>
        <div className="text-end mb-3">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
        {wishlist.length === 0 ? (
          <div className="text-center">Your wishlist is empty!</div>
        ) : (
          <div className="list-group">
            {wishlist.map((item, index) => (
              <div
                className="list-group-item d-flex align-items-start shadow mb-3"
                key={index}
                style={{ cursor: "pointer" }} // Pointer cursor for better UX
              >
                {/* Product Image */}
                <img
                  src={
                    item.thumbnail ||
                    item.images?.[0] ||
                    "https://via.placeholder.com/100"
                  }
                  alt={item.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                  onClick={() => handleItemClick(item)} // Navigate on image click
                />
                {/* Product Details */}
                <div
                  className="flex-grow-1"
                  onClick={() => handleItemClick(item)}
                >
                  <h5 className="mb-1">{item.title}</h5>
                  <p className="mb-1">{item.description}</p>
                  <p className="text-muted">
                    <strong>Price: ₹{item.price * 20}</strong>
                  </p>
                </div>
                {/* Remove Button */}
                <button
                  className="btn p-0"
                  style={{
                    fontSize: "1.5rem",
                    color: "black",
                    border: "none",
                    background: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent item click event
                    handleRemoveClick(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={cancelRemove} centered>
        <Modal.Body className="text-center">
          <p>Are you sure you want to remove this product?</p>
          <Button variant="secondary" className="me-2" onClick={cancelRemove}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Yes, Remove
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Wishlist; 
