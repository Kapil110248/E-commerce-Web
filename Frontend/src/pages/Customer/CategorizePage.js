import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import productService from "../../services/productService"; // backend service import

const CategoryPage = () => {
  const location = useLocation();
  const { category } = location.state; // navigation se category aa rahi hai
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Backend se products load (filter by category)
  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAll();
      const filtered = allProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
      setProducts(filtered);
    } catch (e) {
      setErr("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  const handleBuyNow = (product) => {
    navigate("/product-details", { state: { product } });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-primary">
          {category.toUpperCase()}
        </h2>

        {loading && <p className="text-center">Loading...</p>}
        {err && <p className="text-danger text-center">{err}</p>}

        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card border-0 shadow-sm">
                <img
                  src={
                    typeof product.image === "string" && product.image
                      ? product.image
                      : "https://via.placeholder.com/200?text=No+Image"
                  }
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  <p className="card-text text-muted">₹{product.price}</p>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !products.length && (
            <p className="text-center">No products found in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
