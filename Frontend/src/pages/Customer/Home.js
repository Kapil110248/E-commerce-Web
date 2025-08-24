import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer";
import productService from "../../services/productService";

const Home = ({ cart, setCart, wishlist, setWishlist, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.products || data || []); // handle { products: [...] } or array
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isIn = prev.some((p) => p._id === product._id);
      return isIn ? prev.filter((p) => p._id !== product._id) : [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const featuredProducts = filteredProducts.slice(0, 5);
  const sliderImages = ["/image2.png", "/image3.png", "/image4.png"];

  return (
    <div style={{ width: "100%" }}>
      <div className="container mt-4">
        {/* Top Slider */}
        <Slider {...carouselSettings}>
          {sliderImages.map((src, index) => (
            <div
              key={index}
              className="text-center"
              onClick={() => navigate("/categories")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={src}
                alt={`slide-${index}`}
                className="img-fluid rounded"
                style={{ height: "400px", objectFit: "cover", width: "100%" }}
              />
            </div>
          ))}
        </Slider>

        {/* Featured Products Slider */}
        <h4 className="mt-5 mb-3">Featured Products</h4>
        <Slider {...carouselSettings}>
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="p-3"
              onClick={() => navigate("/product-details", { state: { product } })}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.category}</p>
                  <p className="fw-bold">₹{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* All Products List */}
        <h4 className="mt-5 mb-3">All Products</h4>
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div
              className="col-6 col-sm-4 col-md-3"
              key={product._id}
              onClick={() => navigate("/product-details", { state: { product } })}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-0 position-relative">
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-muted small">{product.category}</p>
                  <p className="fw-bold mb-0">₹{product.price}</p>
                </div>
                <button
                  className="btn position-absolute top-0 end-0 m-2 p-1"
                  style={{
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                      color: wishlist.some((p) => p._id === product._id) ? "#ff4757" : "#ccc",
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
