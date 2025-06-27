import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "restaurants", label: "Restaurants" },
  { key: "addRestaurant", label: "Add New Restaurant" },
  { key: "updateRestaurant", label: "Update Restaurant" },
  { key: "deleteRestaurant", label: "Delete Restaurant" },
  { key: "products", label: "All Products" },
  { key: "users", label: "All Users" },
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

  const token = localStorage.getItem("token");

  // Fetch admin profile
  useEffect(() => {
    if (activeTab === "profile") {
      axios
        .get(`${BACKEND_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProfile(res.data))
        .catch(() => setProfile(null));
    }
  }, [activeTab, token]);

  // Fetch all restaurants
  useEffect(() => {
    if (
      activeTab === "restaurants" ||
      activeTab === "updateRestaurant" ||
      activeTab === "deleteRestaurant"
    ) {
      axios
        .get(`${BACKEND_URL}/admin/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRestaurants(res.data))
        .catch(() => setRestaurants([]));
    }
  }, [activeTab, token, message]);

  // Fetch all products
  useEffect(() => {
    if (activeTab === "products") {
      axios
        .get(`${BACKEND_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data))
        .catch(() => setProducts([]));
    }
  }, [activeTab, token]);

  // Fetch all users
  useEffect(() => {
    if (activeTab === "users") {
      axios
        .get(`${BACKEND_URL}/admin/allUser`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [activeTab, token]);

  // Handle add restaurant
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

  // Handle update restaurant
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

  // Handle delete restaurant
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
  // UI
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-outline-primary${
              activeTab === tab.key ? " active" : ""
            }`}
            onClick={() => {
              setActiveTab(tab.key);
              setMessage("");
              setError("");
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500 }}>
          <h4>Admin Profile</h4>
          {profile ? (
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Username:</strong> {profile.username}
              </li>
              <li className="list-group-item">
                <strong>ID:</strong> {profile._id}
              </li>
            </ul>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}

      {/* All Restaurants */}
      {activeTab === "restaurants" && (
        <div className="card p-4 shadow-sm">
          <h4>All Restaurants</h4>
          {restaurants.length === 0 ? (
            <div>No restaurants found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Image</th> {/* Add this line */}
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
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
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

      {/* Add Restaurant */}
      {activeTab === "addRestaurant" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 600 }}>
          <h4>Add New Restaurant</h4>
          <form onSubmit={handleAddRestaurant}>
            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  type="text"
                  className="form-control"
                  value={addForm.location}
                  onChange={(e) =>
                    setAddForm({ ...addForm, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Type</label>
                <input
                  name="resturantType"
                  type="text"
                  className="form-control"
                  value={addForm.resturantType}
                  onChange={(e) =>
                    setAddForm({ ...addForm, resturantType: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Image URL</label>
                <input
                  name="image"
                  type="text"
                  className="form-control"
                  value={addForm.image}
                  onChange={(e) =>
                    setAddForm({ ...addForm, image: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm({ ...addForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Mobile Number</label>
                <input
                  name="mobileNum"
                  type="text"
                  className="form-control"
                  value={addForm.mobileNum}
                  onChange={(e) =>
                    setAddForm({ ...addForm, mobileNum: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  value={addForm.username}
                  onChange={(e) =>
                    setAddForm({ ...addForm, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Password</label>
                <input
                  name="password"
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
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}
            <button type="submit" className="btn btn-success">
              Add Restaurant
            </button>
          </form>
        </div>
      )}

      {/* Update Restaurant */}
      {activeTab === "updateRestaurant" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 600 }}>
          <h4>Update Restaurant</h4>
          <form onSubmit={handleUpdateRestaurant}>
            <div className="mb-3">
              <label>Select Restaurant</label>
              <select
                className="form-select"
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
              <>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label>Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      value={updateForm.name || ""}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label>Location</label>
                    <input
                      name="location"
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
                  <div className="mb-3 col-md-6">
                    <label>Type</label>
                    <input
                      name="resturantType"
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
                  <div className="mb-3 col-md-6">
                    <label>Image URL</label>
                    <input
                      name="image"
                      type="text"
                      className="form-control"
                      value={updateForm.image || ""}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, image: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      value={updateForm.email || ""}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label>Mobile Number</label>
                    <input
                      name="mobileNum"
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
              </>
            )}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}
            <button type="submit" className="btn btn-warning">
              Update Restaurant
            </button>
          </form>
        </div>
      )}

      {/* Delete Restaurant */}
      {activeTab === "deleteRestaurant" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500 }}>
          <h4>Delete Restaurant</h4>
          <form onSubmit={handleDeleteRestaurant}>
            <div className="mb-3">
              <label>Select Restaurant</label>
              <select
                className="form-select"
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
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}
            <button type="submit" className="btn btn-danger">
              Delete Restaurant
            </button>
          </form>
        </div>
      )}

      {/* All Products */}
      {activeTab === "products" && (
        <div className="card p-4 shadow-sm">
          <h4>All Products</h4>
          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
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

      {/* All Users */}
      {activeTab === "users" && (
        <div className="card p-4 shadow-sm">
          <h4>All Users</h4>
          {users.length === 0 ? (
            <div>No users found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                {/* <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                  </tr>
                </thead> */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.userName}</td>
                      <td>{u.email}</td>
                      <td>{u.mobNum}</td>
                      <td>{u.address}</td>
                    </tr>
                  ))}
                </tbody> */}

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.userName}</td>
                      <td>{u.email}</td>
                      <td>{u.mobNum}</td>
                      <td>{u.address}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
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
  );
}
