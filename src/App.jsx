import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from "./componant/Home/NavBar.jsx";
import Home from "./componant/Home/Home.jsx";
import Offer from "./componant/Home/Offer.jsx";
//import PrivateRoute from "./componant/PrivateRoute";
import './App.css';
import Category from './componant/Home/Category.jsx';
import CartPage from './componant/Home/CartPage.jsx';
import AdminLogin from './componant/Admin/AdminLogin.jsx';
import AdminDashboard from './componant/Admin/AdminDashboard.jsx';
import UserLogin from './componant/User/UserLogin.jsx';
import UserRegister from './componant/User/UserRegister.jsx';
import RestaurantLogin from './componant/Restaurant/RestaurantLogin.jsx';
import RestaurantPage from './componant/Restaurant/RestaurantPage.jsx';
import ProductDetails from './componant/Product/ProductDetails.jsx';
import RestaurantList from './componant/Restaurant/RestaurantList.jsx';
import ProfileDashboard from './componant/User/UserProfile.jsx';
import { UserProvider } from './context/UserContext.jsx';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import MenuPage from './componant/Home/Menu.jsx'; // Import the new MenuPage component
import ContactPage from './componant/Home/ContactUs.jsx'; // Import the new ContactPage component
import OrderPage from './componant/Restaurant/orderPage.jsx';

import './App.css';

// Protected Route Components
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin-login" replace />;
};

const ProtectedUserRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/user-login" replace />;
};

function App() {
  const [theme, setTheme] = useState('light');
  const [cart, setCart] = useState([]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (dish) => {
    const existingItem = cart.find((item) => item.id === dish.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = () => {
    alert('Thank you for your purchase!');
    setCart([]);
  };

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className={`app ${theme}`}>
            <header>
              <NavBar 
                isDarkMode={theme === 'dark'} 
                toggleTheme={toggleTheme} 
                cart={cart} 
              />
            </header>

            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <section aria-label="Special Offer">
                        <Offer theme={theme} />
                      </section>
                      <section aria-label="Food Categories">
                        <Category theme={theme} />
                      </section>
                      <RestaurantList theme={theme} />
                      <Home handleAddToCart={handleAddToCart} theme={theme} />
                    </>
                  }
                />

                {/* Authentication Routes */}
                <Route path="/admin-login" element={<AdminLogin theme={theme} />} />
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route path="/user-login" element={<UserLogin theme={theme} />} />
                <Route path="/user-register" element={<UserRegister theme={theme} />} />
                <Route path="/restaurant-login" element={<RestaurantLogin theme={theme} />} />

                {/* Product Routes */}
                <Route 
                  path="/cart" 
                  element={
                    <CartPage 
                      cart={cart} 
                      onRemove={handleRemoveFromCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onCheckout={handleCheckout} 
                      theme={theme} 
                    />
                  } 
                />
                <Route 
                  path="/products/:id" // Ensure this matches the path used in navigate or Link
                  element={
                    <ProductDetails 
                      handleAddToCart={handleAddToCart} 
                      theme={theme} 
                    />
                  } 
                />
                <Route 
                  path="/menu" 
                  element={
                    <MenuPage 
                      handleAddToCart={handleAddToCart} 
                      theme={theme} 
                    />
                  } 
                />

                {/* Restaurant Routes */}
                <Route 
                  path="/restaurant/:id" 
                  element={
                    <RestaurantPage 
                      handleAddToCart={handleAddToCart} 
                      theme={theme} 
                    />
                  } 
                />
                <Route 
                  path="/order/:id" 
                  element={
                    <ProtectedUserRoute>
                      <OrderPage theme={theme} />
                    </ProtectedUserRoute>
                  } 
                />

                {/* User Routes */}
                <Route 
                  path="/profile/:username" 
                  element={
                    <ProtectedUserRoute>
                      <ProfileDashboard theme={theme} />
                    </ProtectedUserRoute>
                  } 
                />

                {/* Contact Route */}
                <Route path="/contact" element={<ContactPage theme={theme} />} />
                <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className={`footer ${theme}`}>
              <div className="footer-content">
                <div className="footer-section">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/restaurants">Restaurants</a></li>
                    <li><a href="/menu">Menu</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                  </ul>
                </div>

                <div className="footer-section">
                  <h3>Contact Us</h3>
                  <p>Barasat, Kolkata</p>
                  <p>Kolkata, 700124</p>
                  <p>Email: infofoodieexpress@gmail.com</p>
                </div>

                <div className="footer-section">
                  <h3>Follow Us</h3>
                  <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p>© {new Date().getFullYear()} FoodieExpress. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;