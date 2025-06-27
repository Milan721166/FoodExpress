import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, NavDropdown, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaSun, 
  FaMoon, 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaBell, 
  FaEnvelope,
  FaUserShield,
  FaUtensils,
  FaSignOutAlt
} from 'react-icons/fa';
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantPage from "./pages/ResturantPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import CartPage from "./pages/CartPage";
import { CartProvider, useCart } from "./context/CartContext";
import Footer from "./pages/Footer";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : {
      isAuthenticated: false,
      user: null,
      admin: null,
      restaurant: null,
      role: null
    };
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const login = (userData, role, restaurantData = null) => {
    const newAuth = {
      isAuthenticated: true,
      user: role === 'user' ? userData : null,
      admin: role === 'admin' ? userData : null,
      restaurant: role === 'resturant' ? restaurantData : null,
      role: role
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    const newAuth = {
      isAuthenticated: false,
      user: null,
      admin: null,
      restaurant: null,
      role: null
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
    localStorage.removeItem('token');
  };

  return (
    <CartProvider>
      <Router>
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
          <Navbar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            auth={auth}
            login={login}
            logout={logout}
          />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home auth={auth} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/product/:id" element={<ProductDetail auth={auth} />} />
              <Route path="/order/:productId" element={<OrderPage auth={auth} />} />
              <Route path="/adminDashboard" element={<AdminDashboard auth={auth} />} />
              <Route path="/profile" element={<UserProfile auth={auth} />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/cart" element={<CartPage auth={auth} />} />
              <Route path="/resturant/:id" element={<RestaurantPage/>} />
            </Routes>
          </main>
          
         <Footer theme="dark" />
        </div>
      </Router>
    </CartProvider>
  );
}

function Navbar({ darkMode, setDarkMode, auth, logout }) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setExpanded(false);
  };

  const getUserDisplayName = () => {
    if (auth.user) return auth.user.name || auth.user.email;
    if (auth.admin) return auth.admin.username;
    if (auth.restaurant) return auth.restaurant.name;
    return 'Profile';
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="logo-text">FoodExpress</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setExpanded(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutus" className="nav-link" onClick={() => setExpanded(false)}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contactus" className="nav-link" onClick={() => setExpanded(false)}>
                Contact Us
              </Link>
            </li>
          </ul>

          <Form className="d-flex me-2" onSubmit={handleSearch}>
            <div className="input-group">
              <Form.Control
                type="search"
                placeholder="Search..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                <FaSearch />
              </Button>
            </div>
          </Form>

          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              className="me-2" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>

            {auth.isAuthenticated ? (
              <>
                <Button variant="outline-secondary" className="me-2 position-relative">
                  <FaBell />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </Button>
                <Button variant="outline-secondary" className="me-2 position-relative">
                  <FaEnvelope />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    5
                  </span>
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="me-2 position-relative"
                  as={Link}
                  to="/cart"
                >
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Button>

                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" />
                      {getUserDisplayName()}
                    </span>
                  }
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="me-2" /> My Profile
                  </Link>
                  
                  {auth.role === 'admin' && (
                    <Link to="/adminDashboard" className="dropdown-item">
                      <FaUserShield className="me-2" /> Admin Dashboard
                    </Link>
                  )}

                  {auth.role === 'resturant' && (
                    <Link to={`/restaurant/${auth.restaurant?._id || '1'}`} className="dropdown-item">
                      <FaUtensils className="me-2" /> Restaurant Dashboard
                    </Link>
                  )}

                  <NavDropdown.Divider />
                  <Button 
                    variant="link" 
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </Button>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2" onClick={() => setExpanded(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setExpanded(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default App;