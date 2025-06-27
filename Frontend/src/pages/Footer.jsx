import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import '../css/Footer.css'; // Make sure to create this CSS file

const Footer = ({ theme = 'dark' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };

  return (
    <footer className={`footer ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="footer-container">
        <div className="footer-row">
          {/* Quick Links Section */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#">Restaurants</a></li>
              <li><a href="#">Menu</a></li>
              <li><a href="/aboutus">About Us</a></li>
              <li><a href="/contactus">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li><FaMapMarkerAlt className="icon" /> Barasat, Kolkata</li>
              <li>Kolkata, 700124</li>
              <li><FaEnvelope className="icon" /> infofoodieexpressmilanmalay@gmail.com</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="footer-col">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-col">
            <h3>Newsletter</h3>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodieExpress. All rights reserved. Created By Milan & Malay</p>
      </div>
    </footer>
  );
};

export default Footer;