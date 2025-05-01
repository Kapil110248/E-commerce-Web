import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categories = ({ searchQuery = "" }) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch data from the remaining API
        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        // Group products by categories
        const grouped = data.products.reduce((acc, product) => {
          const categoryName = product.category; // Assuming category is available in dummyjson API
          acc[categoryName] = acc[categoryName] || [];
          acc[categoryName].push(product);
          return acc;
        }, {});

        setCategories(grouped);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleItemClick = (product) => {
    navigate("/product-details", { state: { product } }); // Navigate to ProductDetails page
  };

  const handleViewMore = (category, products) => {
    navigate(`/category/${category}`, {
      state: { category, products }, // Pass category and its products
    });
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
                    key={product.id}
                    style={{
                      padding: "5px",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handleItemClick(product)} // Handle item click
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
                          product.images?.[0] ||
                          product.thumbnail ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.title}
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
                          {product.title}
                        </h6>
                        <p
                          className="card-text text-muted"
                          style={{
                            fontSize: "0.8rem",
                          }}
                        >
                          ₹{(product.price * 20).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    handleViewMore(category, categories[category])
                  }
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