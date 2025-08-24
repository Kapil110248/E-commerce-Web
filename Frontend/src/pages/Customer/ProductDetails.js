import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DynamicButton from "../../components/dynamicButton/dynamicButton";
import orderService from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = ({ cart, setCart }) => {
  const location = useLocation();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const { user } = useAuth();

  if (!product) {
    return <div className="text-center mt-5">❌ No product details found!</div>;
  }

  // ✅ Add to Cart
  const addToCart = () => {
    if (product.stock <= 0) {
      toast.error("⚠️ Product is out of stock!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id || item.id === product.id
      );

      if (existingItem) {
        // agar already cart me hai → quantity update karo
        return prevCart.map((item) =>
          item._id === product._id || item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // new product add karo
        return [...prevCart, { ...product, quantity }];
      }
    });

    toast.success(`${product.name || product.title} added to cart 🛒`);
  };

  // ✅ Buy Now → Place Order
  const buyNow = async () => {
    if (!user) {
      toast.error("Please login to place an order!");
      return;
    }

    if (product.stock <= 0) {
      toast.error("⚠️ Product is out of stock!");
      return;
    }

    try {
      const order = {
        items: [
          {
            productId: product._id || product.id,
            quantity,
          },
        ],
        paymentMethod,
        shippingAddress: {
          address: user?.address?.line1 || "Default Address",
          city: user?.address?.city || "Unknown",
          postalCode: user?.address?.postalCode || "000000",
          country: "India",
        },
      };

      console.log("🛒 Sending Order:", JSON.stringify(order, null, 2));

      const res = await orderService.placeOrder(order);

      if (paymentMethod === "COD") {
        toast.success(
          `✅ COD Order placed: ${quantity} × ${product.name || product.title}`
        );
      } else {
        toast.success(
          `✅ Online Order placed: ${quantity} × ${
            product.name || product.title
          }\nTxn: ${res?.paymentInfo?.txnId || "Pending"}`
        );
      }

      console.log("📦 Backend Order Response:", res);
    } catch (err) {
      console.error("❌ Order Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to place order!");
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
      <div
        className="d-flex align-items-start"
        style={{ gap: "20px", flexWrap: "wrap" }}
      >
        {/* Product Image */}
        <img
          src={
            product.image ||
            product.thumbnail ||
            "https://via.placeholder.com/300"
          }
          alt={product.name || product.title}
          className="shadow-sm"
          style={{
            width: "40%",
            maxWidth: "300px",
            borderRadius: "10px",
            objectFit: "cover",
            border: "1px solid #ddd",
          }}
        />

        {/* Product Info */}
        <div style={{ flex: "1" }}>
          <h1 className="mb-3">{product.name || product.title}</h1>
          <p className="mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="fw-bold mb-3">Price: ₹{product.price}</p>
          <p
            className={`mb-3 ${
              product.stock > 0 ? "text-success" : "text-danger"
            }`}
          >
            Stock: {product.stock > 0 ? product.stock : "Out of Stock"}
          </p>

          {/* Quantity Selector */}
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control"
              style={{ width: "120px" }}
              disabled={product.stock === 0}
            />
          </div>

          {/* Payment Method */}
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-select"
              style={{ width: "200px" }}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3">
            <DynamicButton
              label="Add To Cart"
              onClick={addToCart}
              styleClass="btn btn-success"
              disabled={product.stock === 0}
            />
            <DynamicButton
              label="Buy Now"
              onClick={buyNow}
              styleClass="btn btn-warning"
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </div>
  );
};

export default ProductDetails;
