import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css"; // Import the CSS file
import { motion, AnimatePresence } from "framer-motion"; // Import animation components

const initialUserForm = {
  userName: "",
  email: "",
  mobNum: "",
  password: "",
  address: "",
};

const initialAdminForm = {
  username: "",
  password: "",
};

const SignUp = ({ darkMode }) => {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState(initialUserForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setSuccess("");
    setForm(newRole === "user" ? initialUserForm : initialAdminForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (role === "user") {
        const res = await axios.post(`${BACKEND_URL}/users/signup`, form);
        setSuccess(res.data.message || "Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else if (role === "admin") {
        const res = await axios.post(`${BACKEND_URL}/admin/signup`, form);
        setSuccess(res.data.message || "Admin registration successful!");
        setTimeout(() => navigate("/adminDashboard"), 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <motion.div 
      className="signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
      className={`signup-container ${darkMode ? 'dark-mode' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    ></motion.div>
      <motion.div 
        className="signup-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="signup-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2>Create Account</h2>
          <p>Join us today and get started</p>
        </motion.div>

        <motion.div 
          className="role-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            className={`role-btn ${role === "user" ? "active" : ""}`}
            onClick={() => handleRoleChange("user")}
          >
            User
          </button>
          <button
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="signup-form">
          <AnimatePresence mode="wait">
            {role === "user" && (
              <motion.div
                key="user-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="form-group">
                  <label>Full Name</label>
                  <motion.input
                    name="userName"
                    type="text"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <motion.input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <motion.input
                    name="mobNum"
                    type="tel"
                    value={form.mobNum}
                    onChange={handleChange}
                    required
                    placeholder="Enter your mobile number"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <motion.input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <motion.input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </motion.div>
            )}

            {role === "admin" && (
              <motion.div
                key="admin-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="admin-signup"
              >
                <div className="admin-header">
                  <motion.div 
                    className="admin-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
                    </svg>
                  </motion.div>
                  <h3>Admin Registration</h3>
                  <p>Enter your administrator credentials</p>
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <motion.input
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin username"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <motion.input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin password"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                className="alert-message error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                className="alert-message success"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit" 
            className="submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {role === "admin" ? "Register as Admin" : "Sign Up"}
          </motion.button>

          <motion.div 
            className="login-redirect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;