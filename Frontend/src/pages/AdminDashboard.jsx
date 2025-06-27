import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import "../css/AdminDashboard.css";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "restaurants", label: "Restaurants" },
  { key: "addRestaurant", label: "Add Restaurant" },
  { key: "updateRestaurant", label: "Update Restaurant" },
  { key: "deleteRestaurant", label: "Delete Restaurant" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [addForm, setAddForm] = useState({
    name: "",
    location: "",
    image: "",
    resturantType: "",
    email: "",
    mobileNum: "",
    username: "",
    password: "",
  });
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (activeTab === "profile") {
      axios.get(`${BACKEND_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "restaurants" || activeTab === "updateRestaurant" || activeTab === "deleteRestaurant") {
      axios.get(`${BACKEND_URL}/admin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRestaurants(res.data))
      .catch(() => setRestaurants([]));
    }
  }, [activeTab, token, message]);

  useEffect(() => {
    if (activeTab === "products") {
      axios.get(`${BACKEND_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "users") {
      axios.get(`${BACKEND_URL}/admin/allUser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
    }
  }, [activeTab, token]);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axios.post(`${BACKEND_URL}/admin/restaurants`, addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Restaurant added successfully!");
      setAddForm({
        name: "",
        location: "",
        image: "",
        resturantType: "",
        email: "",
        mobileNum: "",
        username: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add restaurant.");
    }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!updateId) {
      setError("Please select a restaurant to update.");
      return;
    }
    try {
      await axios.put(
        `${BACKEND_URL}/admin/restaurants/${updateId}`,
        updateForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Restaurant updated successfully!");
      setUpdateId("");
      setUpdateForm({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update restaurant.");
    }
  };

  const handleDeleteRestaurant = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!deleteId) {
      setError("Please select a restaurant to delete.");
      return;
    }
    try {
      await axios.delete(`${BACKEND_URL}/admin/restaurants/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Restaurant deleted successfully!");
      setDeleteId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete restaurant.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setMessage("");
    try {
      await axios.delete(`${BACKEND_URL}/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted successfully!");
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="header-top">
            <h2>Admin Panel</h2>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </button>
          </div>
          <div className="user-info">
            {profile && <div className="user-name">{profile.username}</div>}
            <div className="user-status">
              <span className="status-indicator online"></span>
              Online
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {TABS.map((tab) => (
              <li 
                key={tab.key}
                className={activeTab === tab.key ? "active" : ""}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMessage("");
                  setError("");
                }}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content1">
        <div className="content-container">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {activeTab === "profile" && (
            <div className="card profile-card">
              <h4>Admin Profile</h4>
              {profile ? (
                <ul className="profile-info">
                  <li>
                    <strong>Username:</strong> {profile.username}
                  </li>
                  <li>
                    <strong>ID:</strong> {profile._id}
                  </li>
                </ul>
              ) : (
                <div>Loading profile...</div>
              )}
            </div>
          )}

          {activeTab === "restaurants" && (
            <div className="card">
              <h4>All Restaurants</h4>
              {restaurants.length === 0 ? (
                <div>No restaurants found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Email</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map((r) => (
                        <tr key={r._id}>
                          <td>
                            <img
                              src={r.image}
                              alt={r.name}
                              className="restaurant-image"
                            />
                          </td>
                          <td>{r.name}</td>
                          <td>{r.location}</td>
                          <td>{r.resturantType}</td>
                          <td>{r.email}</td>
                          <td>{r.mobileNum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "addRestaurant" && (
            <div className="card form-card">
              <h4>Add New Restaurant</h4>
              <form onSubmit={handleAddRestaurant}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm({ ...addForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.location}
                      onChange={(e) =>
                        setAddForm({ ...addForm, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.resturantType}
                      onChange={(e) =>
                        setAddForm({ ...addForm, resturantType: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.image}
                      onChange={(e) =>
                        setAddForm({ ...addForm, image: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={addForm.email}
                      onChange={(e) =>
                        setAddForm({ ...addForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.mobileNum}
                      onChange={(e) =>
                        setAddForm({ ...addForm, mobileNum: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.username}
                      onChange={(e) =>
                        setAddForm({ ...addForm, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={addForm.password}
                      onChange={(e) =>
                        setAddForm({ ...addForm, password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Restaurant
                </button>
              </form>
            </div>
          )}

          {activeTab === "updateRestaurant" && (
            <div className="card form-card">
              <h4>Update Restaurant</h4>
              <form onSubmit={handleUpdateRestaurant}>
                <div className="form-group">
                  <label>Select Restaurant</label>
                  <select
                    className="form-control"
                    value={updateId}
                    onChange={(e) => {
                      setUpdateId(e.target.value);
                      const rest = restaurants.find(
                        (r) => r._id === e.target.value
                      );
                      setUpdateForm(rest || {});
                    }}
                    required
                  >
                    <option value="">Select...</option>
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                {updateId && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.name || ""}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.location || ""}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.resturantType || ""}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            resturantType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.image || ""}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, image: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={updateForm.email || ""}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.mobileNum || ""}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            mobileNum: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <button type="submit" className="btn btn-warning">
                  Update Restaurant
                </button>
              </form>
            </div>
          )}

          {activeTab === "deleteRestaurant" && (
            <div className="card form-card">
              <h4>Delete Restaurant</h4>
              <form onSubmit={handleDeleteRestaurant}>
                <div className="form-group">
                  <label>Select Restaurant</label>
                  <select
                    className="form-control"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-danger">
                  Delete Restaurant
                </button>
              </form>
            </div>
          )}

          {activeTab === "products" && (
            <div className="card">
              <h4>All Products</h4>
              {products.length === 0 ? (
                <div>No products found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Restaurant</th>
                        <th>Price</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>
                            {p.restaurant?.name ||
                              p.restaurant?.restaurantName ||
                              "N/A"}
                          </td>
                          <td>₹{p.price}</td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="card">
              <h4>All Users</h4>
              {users.length === 0 ? (
                <div>No users found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.userName}</td>
                          <td>{u.email}</td>
                          <td>{u.mobNum}</td>
                          <td>{u.address}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}