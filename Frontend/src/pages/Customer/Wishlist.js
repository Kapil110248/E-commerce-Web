import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import wishlistService from "../../services/wishlistService";
import { useAuth } from "../../context/AuthContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ logged-in user ke pass token hona chahiye

  // ✅ Load wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.token) return;
      try {
        const data = await wishlistService.getWishlist(user.token);
        setWishlist(data); // backend se direct products aaenge
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleItemClick = (item) => {
    navigate("/product-details", { state: { product: item } });
  };

  const handleRemoveClick = (productId) => {
    setItemToRemove(productId);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    try {
      if (!user?.token) return;
      const updated = await wishlistService.removeFromWishlist(
        itemToRemove,
        user.token
      );
      setWishlist(updated);
      console.log("Removed from wishlist:", itemToRemove);
    } catch (err) {
      console.error("Remove failed", err);
    }
    setShowModal(false);
  };

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
            {wishlist.map((item) => (
              <div
                className="list-group-item d-flex align-items-start shadow mb-3"
                key={item._id}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                  onClick={() => handleItemClick(item)}
                />
                <div
                  className="flex-grow-1"
                  onClick={() => handleItemClick(item)}
                >
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1 text-muted">{item.category}</p>
                  <p className="text-muted">
                    <strong>Price: ₹{item.price}</strong>
                  </p>
                </div>
                <button
                  className="btn p-0"
                  style={{
                    fontSize: "1.5rem",
                    color: "black",
                    border: "none",
                    background: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClick(item._id);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
