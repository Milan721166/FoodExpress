import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaMotorcycle, FaUtensils, FaSmile, FaFire, FaEye } from 'react-icons/fa';
import { BiCartAdd, BiRefresh } from 'react-icons/bi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import "../css/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Banner Section */}
      <section className={`food-delivery-banner ${darkMode ? 'dark-mode' : ''}`}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="banner-content">
              <h1 className="banner-title">
                <span className="highlight">Delicious Food</span> Delivered Fast
              </h1>
              <p className="banner-subtitle">
                Order from your favorite restaurants and get fresh, hot food delivered to your doorstep in minutes.
              </p>
              <div className="banner-cta">
                <Button variant="danger" className="cta-button me-3">
                  Order Now <span className="cta-arrow">→</span>
                </Button>
                <Button variant={darkMode ? "outline-light" : "outline-dark"} className="cta-button">
                  View Menu
                </Button>
              </div>
              <div className="stats-container">
                <div className="stat-item">
                  <FaSmile className="stat-icon" />
                  <div>
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Happy Customers</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaUtensils className="stat-icon" />
                  <div>
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Restaurants</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaMotorcycle className="stat-icon" />
                  <div>
                    <span className="stat-number">20 min</span>
                    <span className="stat-label">Avg Delivery</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} className="search-section">
              <div className={`discover-card ${darkMode ? 'dark-mode' : ''}`}>
                <h2 className="discover-title">Discover Amazing Food</h2>
                <p className="discover-text">
                  Explore our curated selection of dishes from the best restaurants in your city
                </p>
                <div className={`search-box ${darkMode ? 'dark-mode' : ''}`}>
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search for dishes, restaurants, or cuisines..." 
                    className="search-input"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <div className="container py-5">
        <h2 className={`mb-4 text-center section-title ${darkMode ? 'dark-mode' : ''}`}>
          <span className="title-underline ">Our Products</span>
        </h2>
        {loading ? (
          <div className="text-center loading-spinner">
            <div className={`spinner-grow ${darkMode ? 'text-light' : 'text-primary'}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className={`mt-3 loading-text ${darkMode ? 'dark-mode' : ''}`}>Loading delicious options...</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div
                  className={`card h-100 product-card ${
                    hoveredProduct === product._id ? "card-hover" : ""
                  } ${darkMode ? 'dark-mode' : ''}`}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="product-image-container">
                    <img
                      src={
                        product.imageUrl ||
                        product.image ||
                        "/placeholder-food.jpg"
                      }
                      className={`card-img-top product-image ${
                        hoveredProduct === product._id ? "image-zoom" : ""
                      }`}
                      alt={product.name}
                    />
                    <div
                      className={`product-overlay ${
                        hoveredProduct === product._id ? "overlay-show" : ""
                      }`}
                    >
                      <span className="view-details">
                        <FaEye className="me-2" />
                        View Details
                      </span>
                    </div>
                    {hoveredProduct === product._id && (
                      <div className="product-ribbon">
                        <MdOutlineLocalOffer className="me-1" />
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className={`card-title product-name ${darkMode ? 'dark-mode' : ''}`}>
                      {product.name}
                      {hoveredProduct === product._id && (
                        <span className="product-hot-indicator">
                          <FaFire />
                        </span>
                      )}
                    </h5>
                    <p className={`card-text product-description ${darkMode ? 'dark-mode' : ''}`}>
                      {product.description.length > 60
                        ? `${product.description.substring(0, 60)}...`
                        : product.description}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className={`fw-bold product-price ${darkMode ? 'dark-mode' : ''}`}>
                        ₹{product.price}
                        <span className="price-decimal">.00</span>
                      </span>
                      <button
                        className={`btn btn-sm add-to-cart-btn ${
                          hoveredProduct === product._id
                            ? darkMode ? "btn-warning" : "btn-primary"
                            : darkMode ? "btn-outline-light" : "btn-outline-primary"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <BiCartAdd className="me-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className={`col-12 text-center no-products ${darkMode ? 'dark-mode' : ''}`}>
                <div className="empty-state-icon">
                  <i className="bi bi-emoji-frown"></i>
                </div>
                <h5 className="mt-3">No products available</h5>
                <p className={darkMode ? 'text-light' : 'text-muted'}>
                  We couldn't find any products. Please check back later!
                </p>
                <button
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} mt-2`}
                  onClick={() => window.location.reload()}
                >
                  <BiRefresh className="me-1" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;