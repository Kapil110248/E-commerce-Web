import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer   style={{ backgroundColor: "#002147" }} className="text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-md-3">
            <h5>E-Store</h5>
            <p>
              Discover the best deals, explore new arrivals, and shop with ease.
            </p>
          </div>

          {/* Column 2 */}
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-light text-decoration-none">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-light text-decoration-none">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-md-3">
            <h5>Contact Us</h5>
            <p>
    Email: 
    <a
      href="mailto:EStoreOfficial@628.com"
      className="text-light text-decoration-none"
      style={{ cursor: "pointer" }}
    >
      EStoreOfficial@628.com
    </a>
  </p>
            
    Phone: 
    <a
      href="tel:+917354598628"
      className="text-light text-decoration-none"
      style={{ cursor: "pointer" }}
    >
      +91 7354598628
    </a>
            <p>Address: Indore, MP, India
              <a href="https://www.google.com/maps/place/Bilawali,+Madhya+Pradesh+452020/@22.6720451,75.86518,15z/data=!3m1!4b1!4m6!3m5!1s0x3962fc92072b38d1:0x3197bf9ce25a8e1d!8m2!3d22.6729888!4d75.8635625!16s%2Fg%2F12hlbh6b1?entry=ttu&g_ep=EgoyMDI1MDMxNy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
      className="text-light text-decoration-none"
      style={{ cursor: "pointer" }}/>
            </p>
          </div>

          {/* Column 4 */}
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a
                href="https://www.facebook.com/EStoreOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} E-Store. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer
