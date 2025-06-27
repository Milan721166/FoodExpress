import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserShield, FaUtensils, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import "../css/Login.css";

const initialUserForm = { email: "", password: "" };
const initialAdminForm = { username: "", password: "" };
const initialResturantForm = { username: "", password: "" };

const Login = ({ login }) => {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState(initialUserForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setShowSuccess(false);
    if (newRole === "user") setForm(initialUserForm);
    else if (newRole === "admin") setForm(initialAdminForm);
    else setForm(initialResturantForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setShowSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowSuccess(false);
    
    try {
      let res;
      if (role === "user") {
        res = await axios.post(`${BACKEND_URL}/users/login`, form);
        login(res.data.user, "user");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSuccessMessage("User login successful!");
      } else if (role === "admin") {
        res = await axios.post(`${BACKEND_URL}/admin/login`, form);
        login(res.data.admin, "admin");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        setSuccessMessage("Admin login successful!");
      } else if (role === "resturant") {
        res = await axios.post(`${BACKEND_URL}/resturant-auth/login`, form);
        login(res.data.resturant, "resturant", res.data.resturant);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("resturant", JSON.stringify(res.data.resturant));
        setSuccessMessage("Restaurant login successful!");
      }
      
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        if (role === "user") navigate("/");
        else if (role === "admin") navigate("/adminDashboard");
        else navigate(`/resturant/${res.data.resturant._id}`);
      }, 2000);
      
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page-container">
      {showSuccess ? (
        <div className="success-animation-container">
          <div className="success-animation">
            <div className="success-circle">
              <FaCheck className="success-check" />
            </div>
            <h3>{successMessage}</h3>
            <p>Redirecting...</p>
          </div>
        </div>
      ) : (
        <div className="login_form_container">
          <form onSubmit={handleSubmit} className="login_form">
            <h2>LOGIN</h2>
            
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === "user" ? "active" : ""}`}
                onClick={() => handleRoleChange("user")}
              >
                <FaUser className={`role-icon ${role === "user" ? "glowIcon" : "icon"}`} /> User
              </button>
              <button
                type="button"
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("admin")}
              >
                <FaUserShield className={`role-icon ${role === "admin" ? "glowIcon" : "icon"}`} /> Admin
              </button>
              <button
                type="button"
                className={`role-btn ${role === "resturant" ? "active" : ""}`}
                onClick={() => handleRoleChange("resturant")}
              >
                <FaUtensils className={`role-icon ${role === "resturant" ? "glowIcon" : "icon"}`} /> Restaurant
              </button>
            </div>

            {role === "user" && (
              <>
                <div className="input_group">
                  <FaEnvelope className={`input-icon ${form.email ? "glowIcon" : "icon"}`} />
                  <input
                    name="email"
                    type="email"
                    className="input_text"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input_group">
                  <FaLock className={`input-icon ${form.password ? "glowIcon" : "icon"}`} />
                  <input
                    name="password"
                    type="password"
                    className="input_text"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {(role === "admin" || role === "resturant") && (
              <>
                <div className="input_group">
                  <FaUser className={`input-icon ${form.username ? "glowIcon" : "icon"}`} />
                  <input
                    name="username"
                    type="text"
                    className="input_text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input_group">
                  <FaLock className={`input-icon ${form.password ? "glowIcon" : "icon"}`} />
                  <input
                    name="password"
                    type="password"
                    className="input_text"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {error && <div className="error-message">{error}</div>}

            <div id="login_button">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </div>

            <div className="fotter">
              <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
              <span onClick={() => navigate("/signup")}>Register</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;