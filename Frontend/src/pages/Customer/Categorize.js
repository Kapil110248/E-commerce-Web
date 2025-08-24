import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../services/productService"; // backend service import

const Categories = ({ searchQuery = "" }) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAll();

        // ✅ search filter
        const filtered = products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // ✅ Group products by category
        const grouped = filtered.reduce((acc, product) => {
          const categoryName = product.category || "Others";
          acc[categoryName] = acc[categoryName] || [];
          acc[categoryName].push(product);
          return acc;
        }, {});

        setCategories(grouped);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleItemClick = (product) => {
    navigate("/product-details", { state: { product } });
  };

  const handleViewMore = (category) => {
    navigate(`/category/${category}`, { state: { category } });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <strong>Loading categories...</strong>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">Error: {error}</div>;
  }

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container mt-5">
        <div className="row">
          {Object.keys(categories).map((category, index) => (
            <div
              key={category}
              className="col-lg-4 col-md-6 mb-4"
              style={{
                padding: "15px",
                background: index % 2 === 0 ? "#f8f9fa" : "#e3f2fd",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                className="text-center text-dark mb-4"
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  borderBottom: "2px solid #0275d8",
                }}
              >
                {category}
              </h2>
              <div className="row">
                {categories[category].slice(0, 4).map((product) => (
                  <div
                    className="col-6 mb-3"
                    key={product._id}
                    style={{
                      padding: "5px",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handleItemClick(product)}
                  >
                    <div
                      className="card border-0 shadow-sm"
                      style={{
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/150?text=No+Image"
                        }
                        alt={product.name}
                        className="card-img-top"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body text-center">
                        <h6
                          className="card-title text-truncate"
                          style={{
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            color: "#333",
                          }}
                        >
                          {product.name}
                        </h6>
                        <p
                          className="card-text text-muted"
                          style={{
                            fontSize: "0.8rem",
                          }}
                        >
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewMore(category)}
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
