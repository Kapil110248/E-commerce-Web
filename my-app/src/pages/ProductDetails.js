import React from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DynamicButton from "../components/dynamicButton/dynamicButton";

const ProductDetails = ({ cart, setCart }) => {
  const location = useLocation();
  const product = location.state?.product; // Retrieve product passed via navigation

  if (!product) {
    return <div className="text-center mt-5">No product details found!</div>;
  }

  const addToCart = () => {
    if (!cart.some((item) => item.id === product.id)) {
      setCart((prevCart) => [...prevCart, product]); // Add product to cart
      toast.success(`${product.title} has been added to your cart!`); // Success notification
    } else {
      toast.info(`${product.title} is already in the cart!`); // Notify if already in cart
    }
  };

  const buyNow = () => {
    toast.success(`Thank you for purchasing ${product.title}!`); // Success message for purchase
    // Additional purchase logic can be implemented here
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "80px", // Add spacing from the top
        padding: "20px", // Inner padding for content
      }}
    >
      <div
        className="d-flex align-items-start"
        style={{
          gap: "20px", // Space between image and details
          flexWrap: "wrap", // Ensure responsiveness
        }}
      >
        <img
          src={
            product.images?.[0] ||
            product.thumbnail ||
            "https://via.placeholder.com/150"
          }
          alt={product.title}
          style={{
            width: "40%",
            maxWidth: "300px",
            borderRadius: "10px",
          }}
        />

        <div style={{ flex: "1" }}>
          <h1 className="mb-4">{product.title}</h1>
          <p className="mb-3">{product.description}</p>
          <p className="fw-bold mb-4">
            Price: ₹{(product.price * 20).toFixed(2)}
          </p>
          <div className="d-flex gap-3">
          <DynamicButton 
  label="Add To Cart" 
  onClick={addToCart} 
  styleClass="btn btn-success" 

/>

<DynamicButton 
  label="Buy Now" 
  onClick={buyNow} 
  styleClass="btn btn-warning" 

/>
          </div>
        </div>
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

export default ProductDetails;
