import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CategoryPage = () => {
  const location = useLocation();
  const { category, products } = location.state; // Get category data passed from navigation
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    navigate("/product-details", { state: { product } }); // Navigate to ProductDetails with product data
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container mt-5">
        {/* <h1 className="text-center mb-4 text-primary">
          {category.toUpperCase()}
        </h1> */}
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card border-0 shadow-sm">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{product.title}</h5>
                  <p className="card-text text-muted">
                    ₹{(product.price * 20).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleBuyNow(product)} // Navigate to ProductDetails
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
