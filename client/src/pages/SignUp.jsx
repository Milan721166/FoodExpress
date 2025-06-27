import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

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

const SignUp = () => {
  const [role, setRole] = useState("user"); // user or admin
  const [form, setForm] = useState(initialUserForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Reset form when role changes
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");
  //   try {
  //     if (role === "user") {
  //       const res = await axios.post(`${BACKEND_URL}/users/signup`, form);
  //       setSuccess(res.data.message || "Registration successful!");
  //       setTimeout(() => navigate("/login"), 1500);
  //     } else if (role === "admin") {
  //       const res = await axios.post(`${BACKEND_URL}/admin/signup`, form);
  //       setSuccess(res.data.message || "Admin registration successful!");
  //       setTimeout(() => navigate("/login"), 1500);
  //     }
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message || "Registration failed. Please try again."
  //     );
  //   }
  // };

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
        setTimeout(() => navigate("/adminDashboard"), 1500); // <-- Redirect to admin dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      <div className="mb-3 d-flex justify-content-center">
        <button
          className={`btn btn-outline-primary me-2 ${
            role === "user" ? "active" : ""
          }`}
          onClick={() => handleRoleChange("user")}
        >
          User
        </button>
        <button
          className={`btn btn-outline-dark ${role === "admin" ? "active" : ""}`}
          onClick={() => handleRoleChange("admin")}
        >
          Admin
        </button>
      </div>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {role === "user" && (
          <>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                name="userName"
                type="text"
                className="form-control"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input
                name="mobNum"
                type="text"
                className="form-control"
                value={form.mobNum}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                name="address"
                type="text"
                className="form-control"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {role === "admin" && (
          <>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
        <div className="mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
