import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResturantPage from "./pages/ResturantPage";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/order/:productId" element={<OrderPage />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/resturant/:id" element={<ResturantPage />} />

        {/* Fallback route for 404 Not Found */}
      </Routes>
    </Router>
  );
}

export default App;
