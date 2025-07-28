"use client"

import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { BACKEND_URL } from "../utils/api"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { ThemeContext } from "../context/ThemeContext"
import { Button, Container, Row, Col } from "react-bootstrap"
import {
  FaSearch,
  FaMotorcycle,
  FaUtensils,
  FaSmile,
  FaFire,
  FaStar,
  FaHeart,
  FaTimes,   
  FaArrowUp,
} from "react-icons/fa"
import { BiCartAdd, BiRefresh, BiGridAlt, BiListUl } from "react-icons/bi"
import { MdFilterList, MdLocationOn } from "react-icons/md"
import "../css/Home.css"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { darkMode } = useContext(ThemeContext)

  const categories = ["All", "Pizza", "Burgers", "Indian", "Chinese", "Desserts", "Beverages", "Healthy", "Fast Food"]
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "delivery", label: "Fastest Delivery" },
  ]

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth < 768) {
        setViewMode("grid")
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = categories.indexOf(selectedCategory)
      if (isLeftSwipe && currentIndex < categories.length - 1) {
        setSelectedCategory(categories[currentIndex + 1])
      } else if (isRightSwipe && currentIndex > 0) {
        setSelectedCategory(categories[currentIndex - 1])
      }
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products`)
        setProducts(res.data)
      } catch (err) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 4.5) - (a.rating || 4.5)
        case "delivery":
          return (a.deliveryTime || 25) - (b.deliveryTime || 25)
        default:
          return 0
      }
    })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getProductCols = () => {
    if (windowWidth < 576) return "col-6"
    if (windowWidth < 768) return "col-6"
    if (windowWidth < 992) return "col-6 col-md-4"
    return "col-6 col-md-4 col-lg-3"
  }

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          className="mobile-search-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 style={{ color: darkMode ? "#fff" : "#333", margin: 0 }}>Search Food</h3>
            <button
              className="btn btn-link p-0"
              onClick={() => setShowMobileSearch(false)}
              style={{ fontSize: "1.5rem", color: darkMode ? "#fff" : "#333" }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="position-relative mb-4">
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "1.2rem",
              }}
            />
            <input
              type="text"
              placeholder="Search for dishes, restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "20px 20px 20px 50px",
                borderRadius: "15px",
                border: "2px solid #e0e0e0",
                background: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#333",
                fontSize: "1.1rem",
                outline: "none",
              }}
            />
          </div>

          <div className="mb-4">
            <h5 style={{ color: darkMode ? "#fff" : "#333", marginBottom: "15px" }}>Quick Categories</h5>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => {
                    setSelectedCategory(category)
                    setShowMobileSearch(false)
                  }}
                  style={{ borderRadius: "25px", padding: "10px 20px" }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filters Bottom Sheet */}
      {showMobileFilters && (
        <div
          className="mobile-filters-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9998,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="mobile-filters-content"
            style={{
              background: darkMode ? "#2d2d2d" : "#fff",
              width: "100%",
              borderRadius: "20px 20px 0 0",
              padding: "25px",
              maxHeight: "70vh",
              overflowY: "auto",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ color: darkMode ? "#fff" : "#333", margin: 0 }}>Filters & Sort</h4>
              <button
                className="btn btn-link p-0"
                onClick={() => setShowMobileFilters(false)}
                style={{ fontSize: "1.5rem", color: darkMode ? "#fff" : "#333" }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <h6 style={{ color: darkMode ? "#fff" : "#333", marginBottom: "15px" }}>Categories</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedCategory(category)}
                    style={{ borderRadius: "20px", padding: "8px 16px" }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h6 style={{ color: darkMode ? "#fff" : "#333", marginBottom: "15px" }}>Sort By</h6>
              <div className="d-flex flex-column gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`btn text-start ${sortBy === option.value ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setSortBy(option.value)}
                    style={{ borderRadius: "10px", padding: "12px 16px" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 style={{ color: darkMode ? "#fff" : "#333", marginBottom: "15px" }}>View Mode</h6>
              <div className="d-flex gap-2">
                <button
                  className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("grid")}
                  style={{ borderRadius: "10px", padding: "12px 20px", flex: 1 }}
                >
                  <BiGridAlt className="me-2" />
                  Grid
                </button>
                <button
                  className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("list")}
                  style={{ borderRadius: "10px", padding: "12px 20px", flex: 1 }}
                >
                  <BiListUl className="me-2" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Banner Section */}
      <section
        className={`food-delivery-banner ${darkMode ? "dark-mode" : ""}`}
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: windowWidth < 768 ? "80vh" : "100vh",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Location Bar */}
        <div
          className="d-md-none mobile-location-bar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            padding: "15px 20px",
            zIndex: 10,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ color: "white" }}>
              <MdLocationOn className="me-2" />
              <span style={{ fontSize: "0.9rem" }}>Delivering to Home</span>
            </div>
            <button
              className="btn btn-link p-0"
              onClick={() => setShowMobileSearch(true)}
              style={{ color: "white", fontSize: "1.2rem" }}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div
          className="banner-bubble-1"
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: windowWidth < 768 ? "60px" : "100px",
            height: windowWidth < 768 ? "60px" : "100px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="banner-bubble-2"
          style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: windowWidth < 768 ? "40px" : "60px",
            height: windowWidth < 768 ? "40px" : "60px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 4s ease-in-out infinite reverse",
          }}
        ></div>

        <Container style={{ paddingTop: windowWidth < 768 ? "70px" : "80px" }}>
          <Row className="align-items-center" style={{ minHeight: windowWidth < 768 ? "60vh" : "75vh" }}>
            <Col lg={6} className="banner-content">
              <div className="mb-3">
                <span 
                  className="badge bg-warning text-dark px-3 py-2 rounded-pill"
                  style={{ fontSize: windowWidth < 576 ? "0.8rem" : "0.9rem" }}
                >
                  🔥 Free Delivery on Orders Above ₹299
                </span>
              </div>
              <h1
                className="banner-title"
                style={{
                  fontSize: windowWidth < 576 ? "2rem" : windowWidth < 768 ? "2.5rem" : "clamp(2rem, 8vw, 4rem)",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  className="highlight"
                  style={{
                    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "block",
                  }}
                >
                  Delicious Food
                </span>
                <span style={{ color: "white" }}>Delivered Fast</span>
              </h1>
              <p
                className="banner-subtitle"
                style={{
                  fontSize: windowWidth < 576 ? "1rem" : "clamp(1rem, 3vw, 1.2rem)",
                  marginBottom: "2rem",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Order from your favorite restaurants and get fresh, hot food delivered to your doorstep in minutes.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="banner-cta d-flex flex-column flex-sm-row gap-3 mb-4">
                <Button
                  variant="light"
                  size={windowWidth < 576 ? "md" : "lg"}
                  className="cta-button px-4 py-3 fw-bold"
                  style={{
                    background: "linear-gradient(45deg, #fff, #f8f9fa)",
                    border: "none",
                    color: "#ee5a24",
                    borderRadius: "50px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    transform: "translateY(0)",
                    transition: "all 0.3s ease",
                    minHeight: windowWidth < 576 ? "50px" : "60px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)"
                  }}
                >
                  🍕 Order Now <span className="ms-2">→</span>
                </Button>
                <Button
                  variant="outline-light"
                  size={windowWidth < 576 ? "md" : "lg"}
                  className="cta-button px-4 py-3"
                  style={{
                    borderRadius: "50px",
                    borderWidth: "2px",
                    fontWeight: "600",
                    minHeight: windowWidth < 576 ? "50px" : "60px",
                  }}
                >
                  📋 View Menu
                </Button>
              </div>

              {/* Enhanced Stats - Mobile Optimized */}
              <div
                className="stats-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: windowWidth < 576 ? "repeat(3, 1fr)" : "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <div
                  className="stat-item"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    padding: windowWidth < 576 ? "0.8rem" : "1rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <FaSmile
                    className="stat-icon"
                    style={{ 
                      fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                      color: "#ffd700", 
                      marginBottom: "0.5rem" 
                    }}
                  />
                  <div>
                    <span 
                      className="stat-number" 
                      style={{ 
                        display: "block", 
                        fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                        fontWeight: "bold" 
                      }}
                    >
                      50K+
                    </span>
                    <span 
                      className="stat-label" 
                      style={{ 
                        fontSize: windowWidth < 576 ? "0.7rem" : "0.8rem", 
                        opacity: "0.9" 
                      }}
                    >
                      Customers
                    </span>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    padding: windowWidth < 576 ? "0.8rem" : "1rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <FaUtensils
                    className="stat-icon"
                    style={{ 
                      fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                      color: "#ffd700", 
                      marginBottom: "0.5rem" 
                    }}
                  />
                  <div>
                    <span 
                      className="stat-number" 
                      style={{ 
                        display: "block", 
                        fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                        fontWeight: "bold" 
                      }}
                    >
                      500+
                    </span>
                    <span 
                      className="stat-label" 
                      style={{ 
                        fontSize: windowWidth < 576 ? "0.7rem" : "0.8rem", 
                        opacity: "0.9" 
                      }}
                    >
                      Restaurants
                    </span>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    padding: windowWidth < 576 ? "0.8rem" : "1rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <FaMotorcycle
                    className="stat-icon"
                    style={{ 
                      fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                      color: "#ffd700", 
                      marginBottom: "0.5rem" 
                    }}
                  />
                  <div>
                    <span 
                      className="stat-number" 
                      style={{ 
                        display: "block", 
                        fontSize: windowWidth < 576 ? "1.2rem" : "1.5rem", 
                        fontWeight: "bold" 
                      }}
                    >
                      20 min
                    </span>
                    <span 
                      className="stat-label" 
                      style={{ 
                        fontSize: windowWidth < 576 ? "0.7rem" : "0.8rem", 
                        opacity: "0.9" 
                      }}
                    >
                      Delivery
                    </span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Enhanced Search Section - Hidden on Mobile */}
            <Col lg={6} className="search-section d-none d-lg-block">
              <div
                className={`discover-card ${darkMode ? "dark-mode" : ""}`}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "25px",
                  padding: "2.5rem",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <h2
                  className="discover-title"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: darkMode ? "#fff" : "#333",
                  }}
                >
                  🍽️ Discover Amazing Food
                </h2>
                <p
                  className="discover-text"
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "2rem",
                    color: darkMode ? "rgba(255,255,255,0.8)" : "#666",
                    lineHeight: "1.6",
                  }}
                >
                  Explore our curated selection of dishes from the best restaurants in your city
                </p>

                <div
                  className={`search-box ${darkMode ? "dark-mode" : ""}`}
                  style={{
                    position: "relative",
                    marginBottom: "1.5rem",
                  }}
                >
                  <FaSearch
                    className="search-icon"
                    style={{
                      position: "absolute",
                      left: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                      fontSize: "1.1rem",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search for dishes, restaurants, or cuisines..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "18px 20px 18px 50px",
                      borderRadius: "50px",
                      border: darkMode ? "2px solid rgba(255,255,255,0.1)" : "2px solid #e0e0e0",
                      background: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
                      color: darkMode ? "#fff" : "#333",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => (
                    <button
                      key={category}
                      className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        borderRadius: "20px",
                        padding: "8px 16px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mobile Sticky Header */}
      <div
        className="d-md-none sticky-top mobile-sticky-header"
        style={{
          background: darkMode ? "rgba(45,45,45,0.95)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          padding: "12px 20px",
          zIndex: 1000,
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ margin: 0, color: darkMode ? "#fff" : "#333", fontSize: "1rem" }}>
            {filteredProducts.length} Items Found
          </h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowMobileSearch(true)}
              style={{ 
                borderRadius: "20px", 
                padding: "8px 12px",
                minWidth: "40px",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FaSearch />
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              style={{ 
                borderRadius: "20px", 
                padding: "8px 12px",
                minWidth: "40px",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {viewMode === "grid" ? <BiListUl /> : <BiGridAlt />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Categories Section - Collapsible */}
      <div className="d-md-none mb-3">
        <div 
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => setShowMobileCategories(!showMobileCategories)}
          style={{
            padding: "10px 15px",
            background: darkMode ? "#2d2d2d" : "#f8f9fa",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          <div className="d-flex align-items-center">
            <span style={{ 
              fontWeight: "600",
              color: darkMode ? "#fff" : "#333",
              marginRight: "8px"
            }}>
              {selectedCategory}
            </span>
            <span className="badge bg-primary">
              {filteredProducts.length}
            </span>
          </div>
          <MdFilterList style={{ 
            fontSize: "1.2rem",
            color: darkMode ? "#fff" : "#333"
          }} />
        </div>

        {showMobileCategories && (
          <div
            className="mobile-categories-container"
            style={{
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            <div
              className="d-flex gap-2 mobile-categories-scroll"
              style={{
                minWidth: "max-content",
                padding: "0 15px 10px",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowMobileCategories(false);
                  }}
                  style={{
                    borderRadius: "25px",
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    minWidth: "fit-content",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Products Section */}
      <div className="container py-4">
        {/* Desktop Section Header */}
        <div className="row align-items-center mb-4 d-none d-md-flex">
          <div className="col-md-6">
            <h2
              className={`section-title ${darkMode ? "dark-mode" : ""}`}
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
              }}
            >
              <span
                className="title-underline"
                style={{
                  background: "linear-gradient(45deg, #ee5a24, #ff6b6b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Our Products
              </span>
            </h2>
            <p style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "#666", fontSize: "1.1rem" }}>
              Fresh ingredients, authentic flavors, delivered with love
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "auto",
                  borderRadius: "25px",
                  border: `2px solid ${darkMode ? "rgba(255,255,255,0.2)" : "#e0e0e0"}`,
                  background: darkMode ? "#333" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="btn-group">
                <button
                  className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setViewMode("grid")}
                  style={{ borderRadius: "25px 0 0 25px" }}
                >
                  <BiGridAlt />
                </button>
                <button
                  className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setViewMode("list")}
                  style={{ borderRadius: "0 25px 25px 0" }}
                >
                  <BiListUl />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center loading-spinner py-5">
            <div
              className={`spinner-grow ${darkMode ? "text-light" : "text-primary"}`}
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className={`mt-3 loading-text ${darkMode ? "dark-mode" : ""}`} style={{ fontSize: "1.1rem" }}>
              Loading delicious options...
            </p>
          </div>
        ) : (
          <div className={viewMode === "list" ? "row g-3" : "row g-4"} style={windowWidth < 768 ? {
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            marginRight: "-15px",
            marginLeft: "-15px",
            padding: "0 15px 15px"
          } : {}}>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={viewMode === "list" ? "col-12" : windowWidth < 768 ? "col-12" : getProductCols()}
                style={windowWidth < 768 ? {
                  flex: "0 0 85%",
                  scrollSnapAlign: "start",
                  paddingRight: "10px"
                } : {}}
              >
                <div
                  className={`card h-100 product-card ${
                    hoveredProduct === product._id ? "card-hover" : ""
                  } ${darkMode ? "dark-mode" : ""}`}
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{
                    borderRadius: viewMode === "list" ? "15px" : "20px",
                    border: "none",
                    boxShadow:
                      hoveredProduct === product._id ? "0 20px 40px rgba(0,0,0,0.15)" : "0 8px 25px rgba(0,0,0,0.08)",
                    transform: hoveredProduct === product._id ? "translateY(-8px)" : "translateY(0)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    background: darkMode ? "#2d2d2d" : "#fff",
                    flexDirection: viewMode === "list" ? "row" : "column",
                  }}
                >
                  <div
                    className="product-image-container"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: viewMode === "list" ? "150px" : "100%",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={product.imageUrl || product.image || "/placeholder-food.jpg"}
                      className={`product-image ${hoveredProduct === product._id ? "image-zoom" : ""}`}
                      alt={product.name}
                      style={{
                        height: viewMode === "list" ? "120px" : windowWidth < 576 ? "150px" : "200px",
                        width: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: hoveredProduct === product._id ? "scale(1.1)" : "scale(1)",
                      }}
                    />

                    {/* Mobile-optimized overlays */}
                    <button
                      className="btn btn-light"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: viewMode === "list" ? 1 : hoveredProduct === product._id ? 1 : 0.8,
                        transform: "scale(1)",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaHeart style={{ color: "#ff6b6b", fontSize: "0.9rem" }} />
                    </button>

                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                        padding: "4px 10px",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      <FaStar style={{ color: "#ffd700", fontSize: "0.7rem" }} />
                      4.{Math.floor(Math.random() * 5) + 3}
                    </div>
                  </div>

                  <div
                    className="card-body d-flex flex-column"
                    style={{
                      padding: viewMode === "list" ? "1rem" : windowWidth < 576 ? "1rem" : "1.5rem",
                      flex: 1,
                    }}
                  >
                    <h5
                      className={`card-title product-name ${darkMode ? "dark-mode" : ""}`}
                      style={{
                        fontSize: viewMode === "list" ? "1rem" : windowWidth < 576 ? "1rem" : "1.2rem",
                        fontWeight: "700",
                        marginBottom: "0.5rem",
                        color: darkMode ? "#fff" : "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        lineHeight: "1.3",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: viewMode === "list" ? "nowrap" : "normal",
                        }}
                      >
                        {product.name}
                      </span>
                      {hoveredProduct === product._id && (
                        <span
                          className="product-hot-indicator"
                          style={{
                            color: "#ff6b6b",
                            animation: "pulse 1.5s infinite",
                            marginLeft: "8px",
                          }}
                        >
                          <FaFire />
                        </span>
                      )}
                    </h5>

                    <p
                      className={`card-text product-description ${darkMode ? "dark-mode" : ""}`}
                      style={{
                        color: darkMode ? "rgba(255,255,255,0.7)" : "#666",
                        fontSize: viewMode === "list" ? "0.85rem" : windowWidth < 576 ? "0.8rem" : "0.9rem",
                        lineHeight: "1.4",
                        marginBottom: "1rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: viewMode === "list" ? 2 : 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description}
                    </p>

                    <div className="mt-auto">
                      <div
                        className={`d-flex ${viewMode === "list" ? "justify-content-between align-items-center" : "justify-content-between align-items-center mb-3"}`}
                      >
                        <span
                          className={`fw-bold product-price ${darkMode ? "dark-mode" : ""}`}
                          style={{
                            fontSize: viewMode === "list" ? "1.3rem" : windowWidth < 576 ? "1.2rem" : "1.5rem",
                            color: "#ee5a24",
                            fontWeight: "800",
                          }}
                        >
                          ₹{product.price}
                          <span className="price-decimal" style={{ fontSize: "0.8rem", opacity: "0.7" }}>
                            .00
                          </span>
                        </span>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: darkMode ? "rgba(255,255,255,0.6)" : "#999",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaMotorcycle />
                          25-30 min
                        </div>
                      </div>

                      <button
                        className={`btn ${viewMode === "list" ? "btn-sm" : "w-100"} add-to-cart-btn ${
                          hoveredProduct === product._id
                            ? "btn-primary"
                            : darkMode
                              ? "btn-outline-light"
                              : "btn-outline-primary"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        style={{
                          borderRadius: "25px",
                          padding: viewMode === "list" ? "8px 16px" : windowWidth < 576 ? "10px" : "12px",
                          fontWeight: "600",
                          fontSize: viewMode === "list" ? "0.8rem" : windowWidth < 576 ? "0.8rem" : "0.9rem",
                          transition: "all 0.3s ease",
                          background:
                            hoveredProduct === product._id ? "linear-gradient(45deg, #ee5a24, #ff6b6b)" : "transparent",
                          border:
                            hoveredProduct === product._id
                              ? "none"
                              : `2px solid ${darkMode ? "rgba(255,255,255,0.3)" : "#ee5a24"}`,
                          color: hoveredProduct === product._id ? "white" : darkMode ? "#fff" : "#ee5a24",
                        }}
                      >
                        <BiCartAdd className="me-1" style={{ fontSize: "1rem" }} />
                        {viewMode === "list" ? "Add" : windowWidth < 576 ? "Add" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div
                className={`col-12 text-center no-products ${darkMode ? "dark-mode" : ""}`}
                style={{ padding: "4rem 0" }}
              >
                <div className="empty-state-icon" style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                  🍽️
                </div>
                <h5 className="mt-3" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                  No products found
                </h5>
                <p
                  className={darkMode ? "text-light" : "text-muted"}
                  style={{ fontSize: "1.1rem", marginBottom: "2rem" }}
                >
                  We couldn't find any products matching your criteria. Try adjusting your search!
                </p>
                <button
                  className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-primary"} mt-2`}
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    window.location.reload()
                  }}
                  style={{
                    borderRadius: "50px",
                    padding: "12px 24px",
                    fontWeight: "600",
                  }}
                >
                  <BiRefresh className="me-2" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-top-button"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: windowWidth < 576 ? "45px" : "50px",
            height: windowWidth < 576 ? "45px" : "50px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #ee5a24, #ff6b6b)",
            border: "none",
            color: "white",
            fontSize: windowWidth < 576 ? "1rem" : "1.2rem",
            boxShadow: "0 8px 25px rgba(238, 90, 36, 0.4)",
            zIndex: 1000,
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)"
          }}
        >
          <FaArrowUp />
        </button>
      )}

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .min-vh-75 {
          min-height: 75vh;
        }

        /* Hide scrollbar for category pills */
        .mobile-categories-scroll::-webkit-scrollbar {
          display: none;
        }
        
        /* Mobile optimizations */
        @media (max-width: 1200px) {
          .banner-title {
            font-size: 3rem !important;
          }
        }
        
        @media (max-width: 992px) {
          .banner-title {
            font-size: 2.5rem !important;
          }
          
          .discover-card {
            margin-top: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.8rem !important;
          }
          
          .banner-content {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .discover-card {
            margin-top: 2rem;
          }

          .product-card {
            margin-bottom: 1rem;
          }

          .banner-title {
            font-size: 2.5rem !important;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
          
          .mobile-sticky-header h5 {
            font-size: 1rem;
          }
          
          .row {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            margin-right: -15px;
            margin-left: -15px;
            padding: 0 15px 15px;
          }
          
          .row > div {
            flex: 0 0 85%;
            scroll-snap-align: start;
            padding-right: 10px;
          }
          
          /* Hide scrollbar */
          .row::-webkit-scrollbar {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .banner-title {
            font-size: 2rem !important;
          }
          
          .discover-card {
            padding: 1.5rem !important;
          }
          
          .stats-container .stat-item {
            padding: 0.8rem !important;
          }

          .product-card {
            border-radius: 15px !important;
          }

          .stat-number {
            font-size: 1.3rem !important;
          }

          .stat-label {
            font-size: 0.75rem !important;
          }
          
          .mobile-categories-scroll {
            padding: 0 15px !important;
          }
          
          .mobile-categories-scroll .btn {
            padding: 8px 15px !important;
            font-size: 0.8rem !important;
          }
          
          .mobile-sticky-header {
            padding: 12px 15px !important;
          }
          
          .mobile-sticky-header h5 {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 400px) {
          .banner-title {
            font-size: 1.8rem !important;
          }
          
          .banner-subtitle {
            font-size: 0.95rem !important;
          }
          
          .cta-button {
            padding: 10px 16px !important;
            font-size: 0.9rem !important;
          }
          
          .stats-container {
            gap: 0.5rem !important;
          }
          
          .stat-item {
            padding: 0.6rem !important;
          }
          
          .stat-number {
            font-size: 1.1rem !important;
          }
        }

        /* Touch improvements */
        @media (hover: none) and (pointer: coarse) {
          .product-card:active {
            transform: scale(0.98) !important;
          }

          .btn:active {
            transform: scale(0.95) !important;
          }

          .stat-item:active {
            transform: scale(0.98) !important;
          }
          
          .mobile-categories-scroll .btn:active {
            transform: scale(0.95) !important;
          }
        }

        /* Improved focus states for mobile */
        .btn:focus,
        .form-select:focus,
        input:focus {
          outline: 2px solid #ee5a24;
          outline-offset: 2px;
        }

        /* Better touch targets */
        @media (max-width: 768px) {
          .btn {
            min-height: 44px;
            min-width: 44px;
          }
          
          .mobile-categories-scroll .btn {
            min-height: 38px;
          }
        }
        
        /* Landscape orientation adjustments */
        @media (max-width: 768px) and (orientation: landscape) {
          .food-delivery-banner {
            min-height: 100vh !important;
          }
          
          .banner-content {
            padding-bottom: 2rem;
          }
          
          .stats-container {
            margin-top: 1rem !important;
          }
          
          .row > div {
            flex: 0 0 60%;
          }
        }
      `}</style>
    </div>
  )
}

export default Home


// import { useEffect, useState, useContext } from "react"
// import axios from "axios"
// import { BACKEND_URL } from "../utils/api"
// import { useNavigate } from "react-router-dom"
// import { useCart } from "../context/CartContext"
// // import { ThemeContext } from "../context/ThemeContext" // Removed ThemeContext import
// import { Button, Container, Row, Col } from "react-bootstrap"
// import {
//   FaSearch,
//   FaMotorcycle,
//   FaUtensils,
//   FaSmile,
//   FaFire,
//   FaStar,
//   FaHeart,
//   FaTimes,
//   FaArrowUp,
// } from "react-icons/fa"
// import { BiCartAdd, BiRefresh, BiGridAlt, BiListUl } from "react-icons/bi"
// import { MdFilterList, MdLocationOn } from "react-icons/md"
// import "../css/Home.css"

// const Home = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [hoveredProduct, setHoveredProduct] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("All")
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [showMobileSearch, setShowMobileSearch] = useState(false)
//   const [viewMode, setViewMode] = useState("grid") // grid or list
//   const [sortBy, setSortBy] = useState("popular")
//   const [showScrollTop, setShowScrollTop] = useState(false)
//   const [touchStart, setTouchStart] = useState(null)
//   const [touchEnd, setTouchEnd] = useState(null)
//   const navigate = useNavigate()
//   const { addToCart } = useCart()
//   // const { darkMode } = useContext(ThemeContext) // Removed darkMode from ThemeContext

//   // Since we are enforcing dark mode, we can set a constant
//   const darkMode = true

//   const categories = ["All", "Pizza", "Burgers", "Indian", "Chinese", "Desserts", "Beverages", "Healthy", "Fast Food"]
//   const sortOptions = [
//     { value: "popular", label: "Most Popular" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "rating", label: "Highest Rated" },
//     { value: "delivery", label: "Fastest Delivery" },
//   ]

//   // Scroll to top functionality
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 300)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   // Touch swipe functionality for mobile
//   const handleTouchStart = (e) => {
//     setTouchEnd(null)
//     setTouchStart(e.targetTouches[0].clientX)
//   }

//   const handleTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientX)
//   }

//   const handleTouchEnd = () => {
//     if (!touchStart || !touchEnd) return
//     const distance = touchStart - touchEnd
//     const isLeftSwipe = distance > 50
//     const isRightSwipe = distance < -50

//     if (isLeftSwipe || isRightSwipe) {
//       // Handle swipe actions for category navigation
//       const currentIndex = categories.indexOf(selectedCategory)
//       if (isLeftSwipe && currentIndex < categories.length - 1) {
//         setSelectedCategory(categories[currentIndex + 1])
//       } else if (isRightSwipe && currentIndex > 0) {
//         setSelectedCategory(categories[currentIndex - 1])
//       }
//     }
//   }

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/products`)
//         setProducts(res.data)
//       } catch (err) {
//         setProducts([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchProducts()
//   }, [])

//   const filteredProducts = products
//     .filter((product) => {
//       const matchesSearch =
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
//       return matchesSearch && matchesCategory
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return a.price - b.price
//         case "price-high":
//           return b.price - a.price
//         case "rating":
//           return (b.rating || 4.5) - (a.rating || 4.5)
//         case "delivery":
//           return (a.deliveryTime || 25) - (b.deliveryTime || 25)
//         default:
//           return 0
//       }
//     })

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   return (
//     <div className={`home-container dark-mode`}>
//       {/* Mobile Search Overlay */}
//       {showMobileSearch && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.95)", // Always dark overlay
//             backdropFilter: "blur(10px)",
//             zIndex: 9999,
//             display: "flex",
//             flexDirection: "column",
//             padding: "20px",
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h3 style={{ color: "#fff", margin: 0 }}>Search Food</h3>
//             <button
//               className="btn btn-link p-0"
//               onClick={() => setShowMobileSearch(false)}
//               style={{ fontSize: "1.5rem", color: "#fff" }}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="position-relative mb-4">
//             <FaSearch
//               style={{
//                 position: "absolute",
//                 left: "15px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#999",
//                 fontSize: "1.2rem",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search for dishes, restaurants..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               autoFocus
//               style={{
//                 width: "100%",
//                 padding: "20px 20px 20px 50px",
//                 borderRadius: "15px",
//                 border: "2px solid #333", // Dark mode border
//                 background: "#333", // Dark mode background
//                 color: "#fff", // Dark mode text
//                 fontSize: "1.1rem",
//                 outline: "none",
//               }}
//             />
//           </div>

//           <div className="mb-4">
//             <h5 style={{ color: "#fff", marginBottom: "15px" }}>Quick Categories</h5>
//             <div className="d-flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
//                   onClick={() => {
//                     setSelectedCategory(category)
//                     setShowMobileSearch(false)
//                   }}
//                   style={{ borderRadius: "25px", padding: "10px 20px" }}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Filters Bottom Sheet */}
//       {showMobileFilters && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.5)",
//             zIndex: 9998,
//             display: "flex",
//             alignItems: "flex-end",
//           }}
//           onClick={() => setShowMobileFilters(false)}
//         >
//           <div
//             style={{
//               background: "#2d2d2d", // Always dark
//               width: "100%",
//               borderRadius: "20px 20px 0 0",
//               padding: "25px",
//               maxHeight: "70vh",
//               overflowY: "auto",
//               animation: "slideUp 0.3s ease-out",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h4 style={{ color: "#fff", margin: 0 }}>Filters & Sort</h4>
//               <button
//                 className="btn btn-link p-0"
//                 onClick={() => setShowMobileFilters(false)}
//                 style={{ fontSize: "1.5rem", color: "#fff" }}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="mb-4">
//               <h6 style={{ color: "#fff", marginBottom: "15px" }}>Categories</h6>
//               <div className="d-flex flex-wrap gap-2">
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
//                     onClick={() => setSelectedCategory(category)}
//                     style={{ borderRadius: "20px", padding: "8px 16px" }}
//                   >
//                     {category}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-4">
//               <h6 style={{ color: "#fff", marginBottom: "15px" }}>Sort By</h6>
//               <div className="d-flex flex-column gap-2">
//                 {sortOptions.map((option) => (
//                   <button
//                     key={option.value}
//                     className={`btn text-start ${sortBy === option.value ? "btn-primary" : "btn-outline-secondary"}`}
//                     onClick={() => setSortBy(option.value)}
//                     style={{ borderRadius: "10px", padding: "12px 16px" }}
//                   >
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-3">
//               <h6 style={{ color: "#fff", marginBottom: "15px" }}>View Mode</h6>
//               <div className="d-flex gap-2">
//                 <button
//                   className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
//                   onClick={() => setViewMode("grid")}
//                   style={{ borderRadius: "10px", padding: "12px 20px", flex: 1 }}
//                 >
//                   <BiGridAlt className="me-2" />
//                   Grid
//                 </button>
//                 <button
//                   className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
//                   onClick={() => setViewMode("list")}
//                   style={{ borderRadius: "10px", padding: "12px 20px", flex: 1 }}
//                 >
//                   <BiListUl className="me-2" />
//                   List
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Banner Section */}
//       <section
//         className={`food-delivery-banner dark-mode`}
//         style={{
//           background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", // Always dark gradient
//           position: "relative",
//           overflow: "hidden",
//           minHeight: "100vh",
//         }}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* Mobile Location Bar */}
//         <div
//           className="d-md-none"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             background: "rgba(0,0,0,0.2)",
//             backdropFilter: "blur(10px)",
//             padding: "15px 20px",
//             zIndex: 10,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center">
//             <div className="d-flex align-items-center" style={{ color: "white" }}>
//               <MdLocationOn className="me-2" />
//               <span style={{ fontSize: "0.9rem" }}>Delivering to Home</span>
//             </div>
//             <button
//               className="btn btn-link p-0"
//               onClick={() => setShowMobileSearch(true)}
//               style={{ color: "white", fontSize: "1.2rem" }}
//             >
//               <FaSearch />
//             </button>
//           </div>
//         </div>

//         {/* Animated Background Elements */}
//         <div
//           style={{
//             position: "absolute",
//             top: "10%",
//             right: "10%",
//             width: "100px",
//             height: "100px",
//             background: "rgba(255,255,255,0.1)",
//             borderRadius: "50%",
//             animation: "float 6s ease-in-out infinite",
//           }}
//         ></div>
//         <div
//           style={{
//             position: "absolute",
//             bottom: "20%",
//             left: "5%",
//             width: "60px",
//             height: "60px",
//             background: "rgba(255,255,255,0.1)",
//             borderRadius: "50%",
//             animation: "float 4s ease-in-out infinite reverse",
//           }}
//         ></div>

//         <Container style={{ paddingTop: "80px" }}>
//           <Row className="align-items-center min-vh-75">
//             <Col lg={6} className="banner-content">
//               <div className="mb-3">
//                 <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
//                   🔥 Free Delivery on Orders Above ₹299
//                 </span>
//               </div>
//               <h1
//                 className="banner-title"
//                 style={{
//                   fontSize: "clamp(2rem, 8vw, 4rem)",
//                   fontWeight: "800",
//                   lineHeight: "1.1",
//                   marginBottom: "1.5rem",
//                 }}
//               >
//                 <span
//                   className="highlight"
//                   style={{
//                     background: "linear-gradient(45deg, #ffd700, #ffed4e)",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     display: "block",
//                   }}
//                 >
//                   Delicious Food
//                 </span>
//                 <span style={{ color: "white" }}>Delivered Fast</span>
//               </h1>
//               <p
//                 className="banner-subtitle"
//                 style={{
//                   fontSize: "clamp(1rem, 3vw, 1.2rem)",
//                   marginBottom: "2rem",
//                   color: "rgba(255,255,255,0.9)",
//                 }}
//               >
//                 Order from your favorite restaurants and get fresh, hot food delivered to your doorstep in minutes.
//               </p>

//               {/* Enhanced CTA Buttons */}
//               <div className="banner-cta d-flex flex-column flex-sm-row gap-3 mb-4">
//                 <Button
//                   variant="light"
//                   size="lg"
//                   className="cta-button px-4 py-3 fw-bold"
//                   style={{
//                     background: "linear-gradient(45deg, #fff, #f8f9fa)",
//                     border: "none",
//                     color: "#ee5a24",
//                     borderRadius: "50px",
//                     boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
//                     transform: "translateY(0)",
//                     transition: "all 0.3s ease",
//                     minHeight: "60px",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.transform = "translateY(-2px)"
//                     e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.3)"
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.transform = "translateY(0)"
//                     e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)"
//                   }}
//                 >
//                   🍕 Order Now <span className="ms-2">→</span>
//                 </Button>
//                 <Button
//                   variant="outline-light"
//                   size="lg"
//                   className="cta-button px-4 py-3"
//                   style={{
//                     borderRadius: "50px",
//                     borderWidth: "2px",
//                     fontWeight: "600",
//                     minHeight: "60px",
//                   }}
//                 >
//                   📋 View Menu
//                 </Button>
//               </div>

//               {/* Enhanced Stats - Mobile Optimized */}
//               <div
//                 className="stats-container"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
//                   gap: "1rem",
//                   marginTop: "2rem",
//                 }}
//               >
//                 <div
//                   className="stat-item"
//                   style={{
//                     background: "rgba(255,255,255,0.1)",
//                     backdropFilter: "blur(10px)",
//                     padding: "1rem",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                     border: "1px solid rgba(255,255,255,0.2)",
//                   }}
//                 >
//                   <FaSmile
//                     className="stat-icon"
//                     style={{ fontSize: "1.5rem", color: "#ffd700", marginBottom: "0.5rem" }}
//                   />
//                   <div>
//                     <span className="stat-number" style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold" }}>
//                       50K+
//                     </span>
//                     <span className="stat-label" style={{ fontSize: "0.8rem", opacity: "0.9" }}>
//                       Customers
//                     </span>
//                   </div>
//                 </div>
//                 <div
//                   className="stat-item"
//                   style={{
//                     background: "rgba(255,255,255,0.1)",
//                     backdropFilter: "blur(10px)",
//                     padding: "1rem",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                     border: "1px solid rgba(255,255,255,0.2)",
//                   }}
//                 >
//                   <FaUtensils
//                     className="stat-icon"
//                     style={{ fontSize: "1.5rem", color: "#ffd700", marginBottom: "0.5rem" }}
//                   />
//                   <div>
//                     <span className="stat-number" style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold" }}>
//                       500+
//                     </span>
//                     <span className="stat-label" style={{ fontSize: "0.8rem", opacity: "0.9" }}>
//                       Restaurants
//                     </span>
//                   </div>
//                 </div>
//                 <div
//                   className="stat-item"
//                   style={{
//                     background: "rgba(255,255,255,0.1)",
//                     backdropFilter: "blur(10px)",
//                     padding: "1rem",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                     border: "1px solid rgba(255,255,255,0.2)",
//                   }}
//                 >
//                   <FaMotorcycle
//                     className="stat-icon"
//                     style={{ fontSize: "1.5rem", color: "#ffd700", marginBottom: "0.5rem" }}
//                   />
//                   <div>
//                     <span className="stat-number" style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold" }}>
//                       20 min
//                     </span>
//                     <span className="stat-label" style={{ fontSize: "0.8rem", opacity: "0.9" }}>
//                       Delivery
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Col>

//             {/* Enhanced Search Section - Hidden on Mobile */}
//             <Col lg={6} className="search-section d-none d-lg-block">
//               <div
//                 className={`discover-card dark-mode`}
//                 style={{
//                   background: "rgba(255,255,255,0.05)", // Always dark
//                   backdropFilter: "blur(20px)",
//                   borderRadius: "25px",
//                   padding: "2.5rem",
//                   boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                 }}
//               >
//                 <h2
//                   className="discover-title"
//                   style={{
//                     fontSize: "2rem",
//                     fontWeight: "700",
//                     marginBottom: "1rem",
//                     color: "#fff", // Always white text for dark mode
//                   }}
//                 >
//                   🍽️ Discover Amazing Food
//                 </h2>
//                 <p
//                   className="discover-text"
//                   style={{
//                     fontSize: "1.1rem",
//                     marginBottom: "2rem",
//                     color: "rgba(255,255,255,0.8)", // Always light text for dark mode
//                     lineHeight: "1.6",
//                   }}
//                 >
//                   Explore our curated selection of dishes from the best restaurants in your city
//                 </p>

//                 <div
//                   className={`search-box dark-mode`}
//                   style={{
//                     position: "relative",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   <FaSearch
//                     className="search-icon"
//                     style={{
//                       position: "absolute",
//                       left: "20px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#999",
//                       fontSize: "1.1rem",
//                     }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search for dishes, restaurants, or cuisines..."
//                     className="search-input"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "18px 20px 18px 50px",
//                       borderRadius: "50px",
//                       border: "2px solid rgba(255,255,255,0.1)", // Dark mode border
//                       background: "rgba(255,255,255,0.05)", // Dark mode background
//                       color: "#fff", // Dark mode text
//                       fontSize: "1rem",
//                       outline: "none",
//                       transition: "all 0.3s ease",
//                     }}
//                   />
//                 </div>

//                 <div className="d-flex flex-wrap gap-2">
//                   {categories.slice(0, 4).map((category) => (
//                     <button
//                       key={category}
//                       className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
//                       onClick={() => setSelectedCategory(category)}
//                       style={{
//                         borderRadius: "20px",
//                         padding: "8px 16px",
//                         fontSize: "0.85rem",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Mobile Sticky Header */}
//       <div
//         className="d-md-none sticky-top"
//         style={{
//           background: "rgba(45,45,45,0.95)", // Always dark
//           backdropFilter: "blur(10px)",
//           borderBottom: `1px solid rgba(255,255,255,0.1)`, // Always dark
//           padding: "15px 20px",
//           zIndex: 1000,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center">
//           <h5 style={{ margin: 0, color: "#fff" }}>{filteredProducts.length} Items Found</h5>
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-outline-primary btn-sm"
//               onClick={() => setShowMobileSearch(true)}
//               style={{ borderRadius: "20px", padding: "8px 12px" }}
//             >
//               <FaSearch />
//             </button>
//             <button
//               className="btn btn-outline-primary btn-sm"
//               onClick={() => setShowMobileFilters(true)}
//               style={{ borderRadius: "20px", padding: "8px 12px" }}
//             >
//               <MdFilterList />
//             </button>
//             <button
//               className="btn btn-outline-primary btn-sm"
//               onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
//               style={{ borderRadius: "20px", padding: "8px 12px" }}
//             >
//               {viewMode === "grid" ? <BiListUl /> : <BiGridAlt />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Products Section */}
//       <div className="container py-4">
//         {/* Desktop Section Header */}
//         <div className="row align-items-center mb-4 d-none d-md-flex">
//           <div className="col-md-6">
//             <h2
//               className={`section-title dark-mode`}
//               style={{
//                 fontSize: "2.5rem",
//                 fontWeight: "700",
//                 marginBottom: "0.5rem",
//               }}
//             >
//               <span
//                 className="title-underline"
//                 style={{
//                   background: "linear-gradient(45deg, #ee5a24, #ff6b6b)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Our Products
//               </span>
//             </h2>
//             <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem" }}>
//               Fresh ingredients, authentic flavors, delivered with love
//             </p>
//           </div>

//           <div className="col-md-6 text-md-end">
//             <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center">
//               <select
//                 className="form-select"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 style={{
//                   width: "auto",
//                   borderRadius: "25px",
//                   border: `2px solid rgba(255,255,255,0.2)`, // Always dark
//                   background: "#333", // Always dark
//                   color: "#fff", // Always dark
//                 }}
//               >
//                 {sortOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>

//               <div className="btn-group">
//                 <button
//                   className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
//                   onClick={() => setViewMode("grid")}
//                   style={{ borderRadius: "25px 0 0 25px" }}
//                 >
//                   <BiGridAlt />
//                 </button>
//                 <button
//                   className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
//                   onClick={() => setViewMode("list")}
//                   style={{ borderRadius: "0 25px 25px 0" }}
//                 >
//                   <BiListUl />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Swipeable Category Pills for Mobile */}
//         <div
//           className="d-md-none mb-3"
//           style={{
//             overflowX: "auto",
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             WebkitScrollbar: { display: "none" },
//           }}
//         >
//           <div
//             className="d-flex gap-2"
//             style={{
//               minWidth: "max-content",
//               padding: "0 20px",
//             }}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
//                 onClick={() => setSelectedCategory(category)}
//                 style={{
//                   borderRadius: "25px",
//                   padding: "10px 20px",
//                   fontSize: "0.9rem",
//                   fontWeight: "500",
//                   whiteSpace: "nowrap",
//                   minWidth: "fit-content",
//                 }}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center loading-spinner py-5">
//             <div
//               className={`spinner-grow text-light`} // Always light spinner for dark mode
//               role="status"
//               style={{ width: "3rem", height: "3rem" }}
//             >
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className={`mt-3 loading-text dark-mode`} style={{ fontSize: "1.1rem" }}>
//               Loading delicious options...
//             </p>
//           </div>
//         ) : (
//           <div className={viewMode === "list" ? "row g-3" : "row g-4"}>
//             {filteredProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className={viewMode === "list" ? "col-12" : "col-6 col-md-4 col-lg-3"}
//                 onMouseEnter={() => setHoveredProduct(product._id)}
//                 onMouseLeave={() => setHoveredProduct(null)}
//               >
//                 <div
//                   className={`card h-100 product-card ${
//                     hoveredProduct === product._id ? "card-hover" : ""
//                   } dark-mode`}
//                   onClick={() => navigate(`/product/${product._id}`)}
//                   style={{
//                     borderRadius: viewMode === "list" ? "15px" : "20px",
//                     border: "none",
//                     boxShadow:
//                       hoveredProduct === product._id ? "0 20px 40px rgba(0,0,0,0.15)" : "0 8px 25px rgba(0,0,0,0.08)",
//                     transform: hoveredProduct === product._id ? "translateY(-8px)" : "translateY(0)",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     cursor: "pointer",
//                     overflow: "hidden",
//                     background: "#2d2d2d", // Always dark
//                     flexDirection: viewMode === "list" ? "row" : "column",
//                   }}
//                 >
//                   <div
//                     className="product-image-container"
//                     style={{
//                       position: "relative",
//                       overflow: "hidden",
//                       width: viewMode === "list" ? "150px" : "100%",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <img
//                       src={product.imageUrl || product.image || "/placeholder-food.jpg"}
//                       className={`product-image ${hoveredProduct === product._id ? "image-zoom" : ""}`}
//                       alt={product.name}
//                       style={{
//                         height: viewMode === "list" ? "120px" : "200px",
//                         width: "100%",
//                         objectFit: "cover",
//                         transition: "transform 0.4s ease",
//                         transform: hoveredProduct === product._id ? "scale(1.1)" : "scale(1)",
//                       }}
//                     />

//                     {/* Mobile-optimized overlays */}
//                     <button
//                       className="btn btn-light"
//                       style={{
//                         position: "absolute",
//                         top: "10px",
//                         right: "10px",
//                         width: "35px",
//                         height: "35px",
//                         borderRadius: "50%",
//                         border: "none",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         opacity: viewMode === "list" ? 1 : hoveredProduct === product._id ? 1 : 0.8,
//                         transform: "scale(1)",
//                         transition: "all 0.3s ease",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                       }}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <FaHeart style={{ color: "#ff6b6b", fontSize: "0.9rem" }} />
//                     </button>

//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "10px",
//                         left: "10px",
//                         background: "rgba(255,255,255,0.95)",
//                         backdropFilter: "blur(10px)",
//                         padding: "4px 10px",
//                         borderRadius: "15px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "4px",
//                         fontSize: "0.8rem",
//                         fontWeight: "600",
//                       }}
//                     >
//                       <FaStar style={{ color: "#ffd700", fontSize: "0.7rem" }} />
//                       4.{Math.floor(Math.random() * 5) + 3}
//                     </div>
//                   </div>

//                   <div
//                     className="card-body d-flex flex-column"
//                     style={{
//                       padding: viewMode === "list" ? "1rem" : "1.5rem",
//                       flex: 1,
//                     }}
//                   >
//                     <h5
//                       className={`card-title product-name dark-mode`}
//                       style={{
//                         fontSize: viewMode === "list" ? "1rem" : "1.2rem",
//                         fontWeight: "700",
//                         marginBottom: "0.5rem",
//                         color: "#fff", // Always white for dark mode
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         lineHeight: "1.3",
//                       }}
//                     >
//                       <span
//                         style={{
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: viewMode === "list" ? "nowrap" : "normal",
//                         }}
//                       >
//                         {product.name}
//                       </span>
//                       {hoveredProduct === product._id && (
//                         <span
//                           className="product-hot-indicator"
//                           style={{
//                             color: "#ff6b6b",
//                             animation: "pulse 1.5s infinite",
//                             marginLeft: "8px",
//                           }}
//                         >
//                           <FaFire />
//                         </span>
//                       )}
//                     </h5>

//                     <p
//                       className={`card-text product-description dark-mode`}
//                       style={{
//                         color: "rgba(255,255,255,0.7)", // Always light for dark mode
//                         fontSize: viewMode === "list" ? "0.85rem" : "0.9rem",
//                         lineHeight: "1.4",
//                         marginBottom: "1rem",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         display: "-webkit-box",
//                         WebkitLineClamp: viewMode === "list" ? 2 : 3,
//                         WebkitBoxOrient: "vertical",
//                       }}
//                     >
//                       {product.description}
//                     </p>

//                     <div className="mt-auto">
//                       <div
//                         className={`d-flex ${viewMode === "list" ? "justify-content-between align-items-center" : "justify-content-between align-items-center mb-3"}`}
//                       >
//                         <span
//                           className={`fw-bold product-price dark-mode`}
//                           style={{
//                             fontSize: viewMode === "list" ? "1.3rem" : "1.5rem",
//                             color: "#ee5a24",
//                             fontWeight: "800",
//                           }}
//                         >
//                           ₹{product.price}
//                           <span className="price-decimal" style={{ fontSize: "0.8rem", opacity: "0.7" }}>
//                             .00
//                           </span>
//                         </span>
//                         <div
//                           style={{
//                             fontSize: "0.75rem",
//                             color: "rgba(255,255,255,0.6)", // Always light for dark mode
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                           }}
//                         >
//                           <FaMotorcycle />
//                           25-30 min
//                         </div>
//                       </div>

//                       <button
//                         className={`btn ${viewMode === "list" ? "btn-sm" : "w-100"} add-to-cart-btn ${
//                           hoveredProduct === product._id ? "btn-primary" : "btn-outline-light" // Always outline-light when not hovered
//                         }`}
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           addToCart(product)
//                         }}
//                         style={{
//                           borderRadius: "25px",
//                           padding: viewMode === "list" ? "8px 16px" : "12px",
//                           fontWeight: "600",
//                           fontSize: viewMode === "list" ? "0.8rem" : "0.9rem",
//                           transition: "all 0.3s ease",
//                           background:
//                             hoveredProduct === product._id ? "linear-gradient(45deg, #ee5a24, #ff6b6b)" : "transparent",
//                           border:
//                             hoveredProduct === product._id
//                               ? "none"
//                               : `2px solid rgba(255,255,255,0.3)`, // Always outline in dark mode
//                           color: hoveredProduct === product._id ? "white" : "#fff", // Always white for non-hovered outline
//                         }}
//                       >
//                         <BiCartAdd className="me-1" style={{ fontSize: "1rem" }} />
//                         {viewMode === "list" ? "Add" : "Add to Cart"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {filteredProducts.length === 0 && (
//               <div
//                 className={`col-12 text-center no-products dark-mode`}
//                 style={{ padding: "4rem 0" }}
//               >
//                 <div className="empty-state-icon" style={{ fontSize: "4rem", marginBottom: "1rem" }}>
//                   🍽️
//                 </div>
//                 <h5 className="mt-3" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
//                   No products found
//                 </h5>
//                 <p
//                   className="text-light" // Always light text
//                   style={{ fontSize: "1.1rem", marginBottom: "2rem" }}
//                 >
//                   We couldn't find any products matching your criteria. Try adjusting your search!
//                 </p>
//                 <button
//                   className={`btn btn-outline-light mt-2`} // Always outline-light
//                   onClick={() => {
//                     setSearchTerm("")
//                     setSelectedCategory("All")
//                     window.location.reload()
//                   }}
//                   style={{
//                     borderRadius: "50px",
//                     padding: "12px 24px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   <BiRefresh className="me-2" />
//                   Reset Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Scroll to Top Button */}
//       {showScrollTop && (
//         <button
//           onClick={scrollToTop}
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             width: "50px",
//             height: "50px",
//             borderRadius: "50%",
//             background: "linear-gradient(45deg, #ee5a24, #ff6b6b)",
//             border: "none",
//             color: "white",
//             fontSize: "1.2rem",
//             boxShadow: "0 8px 25px rgba(238, 90, 36, 0.4)",
//             zIndex: 1000,
//             transition: "all 0.3s ease",
//             cursor: "pointer",
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.transform = "scale(1.1)"
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.transform = "scale(1)"
//           }}
//         >
//           <FaArrowUp />
//         </button>
//       )}

//       {/* Enhanced Custom Styles */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
        
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }

//         @keyframes slideUp {
//           from { transform: translateY(100%); }
//           to { transform: translateY(0); }
//         }
        
//         .min-vh-75 {
//           min-height: 75vh;
//         }

//         /* Hide scrollbar for category pills */
//         .d-flex::-webkit-scrollbar {
//           display: none;
//         }
        
//         /* Apply dark mode styles globally */
//         body {
//           background-color: #1a1a1a; // Ensures the body background is dark
//           color: #f8f9fa; // Ensures default text color is light
//         }

//         .home-container.dark-mode {
//             background-color: #1a1a1a;
//             color: #f8f9fa;
//         }

//         .product-card.dark-mode {
//             background-color: #2d2d2d;
//             box-shadow: 0 8px 25px rgba(0,0,0,0.3);
//         }

//         .product-card.dark-mode.card-hover {
//             box-shadow: 0 20px 40px rgba(0,0,0,0.4);
//         }

//         .product-name.dark-mode,
//         .discover-title.dark-mode,
//         .section-title.dark-mode,
//         .loading-text.dark-mode,
//         .no-products.dark-mode h5 {
//             color: #fff !important;
//         }

//         .product-description.dark-mode,
//         .discover-text.dark-mode,
//         .no-products.dark-mode p {
//             color: rgba(255,255,255,0.7) !important;
//         }

//         .form-select {
//             background-color: #333;
//             color: #fff;
//             border-color: rgba(255,255,255,0.2);
//         }
//         .form-select option {
//             background-color: #333;
//             color: #fff;
//         }

//         .btn-outline-secondary {
//             border-color: rgba(255,255,255,0.3);
//             color: #fff;
//         }
//         .btn-outline-secondary:hover {
//             background-color: #ee5a24;
//             border-color: #ee5a24;
//             color: #fff;
//         }

//         .btn-primary {
//             background-color: #ee5a24;
//             border-color: #ee5a24;
//             color: #fff;
//         }
//         .btn-primary:hover {
//             background-color: #ff6b6b;
//             border-color: #ff6b6b;
//             color: #fff;
//         }

//         /* Mobile optimizations */
//         @media (max-width: 768px) {
//           .stats-container {
//             grid-template-columns: repeat(3, 1fr) !important;
//             gap: 0.8rem !important;
//           }
          
//           .banner-content {
//             text-align: center;
//             margin-bottom: 2rem;
//           }
          
//           .discover-card {
//             margin-top: 2rem;
//           }

//           .product-card {
//             margin-bottom: 1rem;
//           }

//           .banner-title {
//             font-size: 2.5rem !important;
//           }

//           .cta-button {
//             width: 100%;
//             max-width: 300px;
//             margin: 0 auto;
//           }
//         }
        
//         @media (max-width: 576px) {
//           .banner-title {
//             font-size: 2rem !important;
//           }
          
//           .discover-card {
//             padding: 1.5rem !important;
//           }
          
//           .stats-container .stat-item {
//             padding: 0.8rem !important;
//           }

//           .product-card {
//             border-radius: 15px !important;
//           }

//           .stat-number {
//             font-size: 1.3rem !important;
//           }

//           .stat-label {
//             font-size: 0.75rem !important;
//           }
//         }

//         /* Touch improvements */
//         @media (hover: none) and (pointer: coarse) {
//           .product-card:active {
//             transform: scale(0.98);
//           }

//           .btn:active {
//             transform: scale(0.95);
//           }

//           .stat-item:active {
//             transform: scale(0.98);
//           }
//         }

//         /* Improved focus states for mobile */
//         .btn:focus,
//         .form-select:focus,
//         input:focus {
//           outline: 2px solid #ee5a24;
//           outline-offset: 2px;
//         }

//         /* Better touch targets */
//         @media (max-width: 768px) {
//           .btn {
//             min-height: 44px;
//             min-width: 44px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Home