import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaMotorcycle, FaUtensils, FaSmile } from 'react-icons/fa';
import '../css/Banner.css'; // Assuming you have a CSS file for styling

const Banner = () => {
  return (
    <section className="food-delivery-banner">
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
              <Button variant="outline-light" className="cta-button">
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
            <div className="discover-card">
              <h2 className="discover-title">Discover Amazing Food</h2>
              <p className="discover-text">
                Explore our curated selection of dishes from the best restaurants in your city
              </p>
              <div className="search-box">
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
  );
};

export default Banner;