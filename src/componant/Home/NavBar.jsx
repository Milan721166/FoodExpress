import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faMoon, 
  faSun, 
  faSignOutAlt, 
  faUserCircle, 
  faCog,
  faUtensils,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../context/UserContext';

function NavBar({ isDarkMode, toggleTheme, cart = [] }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, setUser } = useUser();

  // Safe user display name
  const getUserDisplayName = () => {
    if (!user) return 'Account';
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  // Fetch dishes for search functionality
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/dishes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        // Fallback to mock data if API fails
        setDishes([
          { id: 1, name: "Mock Dish 1", price: 10.99, imageUrl: "mock1.jpg" },
          { id: 2, name: "Mock Dish 2", price: 12.99, imageUrl: "mock2.jpg" },
        ]);
      }
    };
    fetchDishes();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Navigation handlers
  const handleAdminLoginClick = () => {
    navigate('/admin-login');
    setIsDropdownOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setIsDropdownOpen(false);
  };

  const handleUserLoginClick = () => {
    navigate('/user-login');
    setIsDropdownOpen(false);
  };

  const handleUserRegisterClick = () => {
    navigate('/user-register');
    setIsDropdownOpen(false);
  };

  const handleRestaurantLoginClick = () => {
    navigate('/restaurant-login');
    setIsDropdownOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsDropdownOpen(false);
  };

  const handleMenuClick = () => {
    navigate('/menu');
    setIsDropdownOpen(false);
  };

  const handleContactClick = () => {
    navigate('/contact-us');
    setIsDropdownOpen(false);
  };

  // Admin dashboard handler
  const handleAdminDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/admin-login');
    }
    setIsDropdownOpen(false);
  };

  // Restaurant dashboard handler
  const handleRestaurantDashboard = () => {
    if (user?.role === 'restaurant') {
      navigate('/restaurant-dashboard');
    } else {
      navigate('/restaurant-login');
    }
    setIsDropdownOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults(
      query.trim() === '' 
        ? [] 
        : dishes.filter(dish => 
            dish.name.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 5) // Limit to 5 results
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate(`/dish/${searchResults[0].id}`);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <img
            src="https://www.logodesign.net/logo/smoking-burger-with-lettuce-3624ld.png"
            alt="FoodieExpress Logo"
            className="d-inline-block align-text-top me-2"
            width="30"
            height="30"
          />
          <span className="brand-text">FoodieExpress</span>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Main Navigation */}
        <div className={`collapse navbar-collapse ${isDropdownOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleHomeClick}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleMenuClick}>Menu</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleContactClick}>Contact Us</button>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="search-container me-3 position-relative">
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search dishes..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-outline-success" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </form>
            {searchResults.length > 0 && (
              <div className="search-results-dropdown position-absolute bg-white rounded shadow mt-1 w-100">
                {searchResults.map((dish) => (
                  <div 
                    key={dish.id} 
                    className="search-result-item p-2 d-flex align-items-center"
                    onClick={() => {
                      navigate(`/dish/${dish.id}`);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <img 
                      src={dish.imageUrl || 'https://via.placeholder.com/50'} 
                      alt={dish.name} 
                      className="search-result-img me-2 rounded"
                      width="40"
                      height="40"
                    />
                    <div className="search-result-details">
                      <h6 className="mb-0">{dish.name}</h6>
                      <p className="mb-0 text-muted">${dish.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="nav-item me-3">
            <button className="btn btn-link position-relative" onClick={handleCartClick}>
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="nav-item me-3">
            <button 
              className={`btn ${isDarkMode ? 'btn-light' : 'btn-dark'}`}
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
          </div>

          {/* User Dropdown */}
          <div className="nav-item dropdown">
            <button
              className="btn btn-link dropdown-toggle d-flex align-items-center"
              id="userDropdown"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <span>{getUserDisplayName()}</span>
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
              {user ? (
                <>
                  <li className="dropdown-header px-3 py-2">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon 
                        icon={user.role === 'admin' ? faCog : (user.role === 'restaurant' ? faUtensils : faUserCircle)} 
                        className="me-2" 
                        size="lg" 
                      />
                      <div>
                        <h6 className="mb-0">{user.username || user.email}</h6>
                        <small className="text-muted">
                          {user.role === 'admin' ? 'Admin' : (user.role === 'restaurant' ? 'Restaurant' : 'User')}
                        </small>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {user.role === 'admin' && (
                    <li>
                      <button className="dropdown-item" onClick={handleAdminDashboard}>
                        <FontAwesomeIcon icon={faCog} className="me-2" />
                        Admin Dashboard
                      </button>
                    </li>
                  )}
                  {user.role === 'restaurant' && (
                    <li>
                      <button className="dropdown-item" onClick={handleRestaurantDashboard}>
                        <FontAwesomeIcon icon={faUtensils} className="me-2" />
                        Restaurant Dashboard
                      </button>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button className="dropdown-item" onClick={handleUserLoginClick}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      User Login
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleUserRegisterClick}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Register
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleRestaurantLoginClick}>
                      <FontAwesomeIcon icon={faUtensils} className="me-2" />
                      Restaurant Login
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleAdminLoginClick}>
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Admin Login
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;