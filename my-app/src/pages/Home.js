import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";

const Home = ({ cart, setCart, wishlist, setWishlist, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const conversionRate = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) throw new Error("Failed to fetch products.");

        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.some((item) => item.id === product.id);
      return isInWishlist
        ? prevWishlist.filter((item) => item.id !== product.id)
        : [...prevWishlist, product];
    });
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes((searchQuery || "").toLowerCase())
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

  const featuredProducts = filteredProducts.slice(6, 10);
  const sliderImages = ["/image2.png", "/image3.png", "/image4.png"];

  return (
    <div style={{ width: "100%" }} className="fade-in">
      <div className="container mt-5">
        <Slider {...carouselSettings}>
          {sliderImages.map((src, index) => (
            <div
              key={index}
              className="text-center"
              onClick={() => navigate("/categories")} // 👈 navigate to Categories
            >
              <img
                src={src}
                alt={`slide-${index}`}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </Slider>

        {/* ✅ Swipe (Carousel Section) */}
        <div className="mb-5 fade-in">
          <Slider {...carouselSettings}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="text-center bounce"
               
                onClick={() =>
                  navigate("/product-details", { state: { product } })
                }
              >
                <div
                  className="p-4 d-flex align-items-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "10px",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    maxWidth: "100%", // ✅ Full Width
                    flexDirection: "row",
                    cursor: "pointer"
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
                      width: "300px", // ✅ Image Width Increased
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginRight: "20px",
                    }}
                  />
                  <div>
                    <h4 className="text-dark">{product.title}</h4>
                    <p className="text-secondary">{product.description}</p>
                    <p className="text-success fw-bold">
                      ₹{(product.price * conversionRate).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* ✅ Product List */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 fade-in">
          {filteredProducts.map((product) => (
            <div
              className="col"
              key={product.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/product-details", { state: { product } })
              }
            >
              <div className="card h-100 shadow border-0 position-relative">
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
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-truncate">
                    {product.description}
                  </p>
                  <p className="card-text">
                    <strong>
                      Price: ₹{(product.price * conversionRate).toFixed(2)}
                    </strong>
                  </p>
                </div>
                {/* ❤️ Wishlist Button */}
                <button
                  className="btn position-absolute bottom-0 end-0 p-2"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    zIndex: "1",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                      color: wishlist.some((item) => item.id === product.id)
                        ? "#ff4757"
                        : "transparent",
                      stroke: wishlist.some((item) => item.id === product.id)
                        ? "none"
                        : "black",
                      strokeWidth: wishlist.some(
                        (item) => item.id === product.id
                      )
                        ? "0"
                        : "20",
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
