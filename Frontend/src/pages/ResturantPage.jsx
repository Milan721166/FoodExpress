import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useParams } from "react-router-dom";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "products", label: "My Products" },
  { key: "addProduct", label: "Add Product" },
  { key: "updateProduct", label: "Update Product" },
  { key: "deleteProduct", label: "Delete Product" },
  { key: "orders", label: "Orders & Users" },
  { key: "reviews", label: "All Reviews" },
];

export default function ResturantPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [resturant, setResturant] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [addForm, setAddForm] = useState({
    name: "",
    imageUrl: "",
    price: "",
    description: "",
  });
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // For all orders table
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // For toggling between orders and users
  const [showOrders, setShowOrders] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // Get restaurant ID from localStorage (after login)
  const resturantData = JSON.parse(localStorage.getItem("resturant") || "{}");
  const restaurantId = resturantData?._id;

  // Fetch all orders for this restaurant (for the all orders table)
  useEffect(() => {
    if (!restaurantId) return;
    setOrdersLoading(true);
    axios
      .get(`${BACKEND_URL}/orders/restaurant/${restaurantId}`)
      .then((res) => setAllOrders(res.data))
      .catch(() => setAllOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [restaurantId]);

  // Fetch restaurant profile
  useEffect(() => {
    if (activeTab === "profile") {
      axios
        .get(`${BACKEND_URL}/admin/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const found = res.data.find((r) => r._id === id);
          setResturant(found);
        })
        .catch(() => setResturant(null));
    }
  }, [activeTab, id, token]);

  // Fetch products for this restaurant
  useEffect(() => {
    if (
      activeTab === "products" ||
      activeTab === "updateProduct" ||
      activeTab === "deleteProduct" ||
      activeTab === "reviews"
    ) {
      axios
        .get(`${BACKEND_URL}/products/restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data))
        .catch(() => setProducts([]));
    }
  }, [activeTab, id, token, message]);

  // Fetch orders for this restaurant (for the users/orders tab)
  useEffect(() => {
    if (activeTab === "orders" && (showOrders || showUsers)) {
      axios
        .get(`${BACKEND_URL}/orders/restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data);
          // Extract unique users from orders
          const userMap = {};
          res.data.forEach((order) => {
            if (order.user && !userMap[order.user._id]) {
              userMap[order.user._id] = order.user;
            }
          });
          setUsers(Object.values(userMap));
        })
        .catch(() => {
          setOrders([]);
          setUsers([]);
        });
    }
  }, [activeTab, id, token, showOrders, showUsers]);

  // Fetch all reviews for this restaurant's products
  useEffect(() => {
    if (activeTab === "reviews") {
      axios
        .get(`${BACKEND_URL}/reviews/restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setReviews(res.data))
        .catch(() => setReviews([]));
    }
  }, [activeTab, id, token, products]);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axios.post(`${BACKEND_URL}/products`, addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product added successfully!");
      setAddForm({
        name: "",
        imageUrl: "",
        price: "",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!updateId) {
      setError("Please select a product to update.");
      return;
    }
    try {
      await axios.put(`${BACKEND_URL}/products/${updateId}`, updateForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product updated successfully!");
      setUpdateId("");
      setUpdateForm({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!deleteId) {
      setError("Please select a product to delete.");
      return;
    }
    try {
      await axios.delete(`${BACKEND_URL}/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product deleted successfully!");
      setDeleteId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  // Delete user (from orders list)
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
      <h2 className="mb-4 text-center">Restaurant Dashboard</h2>
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-outline-success${
              activeTab === tab.key ? " active" : ""
            }`}
            onClick={() => {
              setActiveTab(tab.key);
              setMessage("");
              setError("");
              setShowOrders(false);
              setShowUsers(false);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500 }}>
          <h4>Restaurant Profile</h4>
          {resturant ? (
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Name:</strong> {resturant.name}
              </li>
              <li className="list-group-item">
                <strong>Type:</strong> {resturant.resturantType}
              </li>
              <li className="list-group-item">
                <strong>Location:</strong> {resturant.location}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {resturant.email}
              </li>
              <li className="list-group-item">
                <strong>Mobile:</strong> {resturant.mobileNum}
              </li>
              <li className="list-group-item">
                <img
                  src={resturant.image}
                  alt={resturant.name}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </li>
            </ul>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}

      {/* All Products */}
      {activeTab === "products" && (
        <div className="card p-4 shadow-sm">
          <h4>My Products</h4>
          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </td>
                      <td>{p.name}</td>
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

      {/* Add Product */}
      {activeTab === "addProduct" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 600 }}>
          <h4>Add New Product</h4>
          <form onSubmit={handleAddProduct}>
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
                <label className="form-label">Image URL</label>
                <input
                  name="imageUrl"
                  type="text"
                  className="form-control"
                  value={addForm.imageUrl}
                  onChange={(e) =>
                    setAddForm({ ...addForm, imageUrl: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  value={addForm.price}
                  onChange={(e) =>
                    setAddForm({ ...addForm, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Description</label>
                <input
                  name="description"
                  type="text"
                  className="form-control"
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
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
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Update Product */}
      {activeTab === "updateProduct" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 600 }}>
          <h4>Update Product</h4>
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-3">
              <label>Select Product</label>
              <select
                className="form-select"
                value={updateId}
                onChange={(e) => {
                  setUpdateId(e.target.value);
                  const prod = products.find((p) => p._id === e.target.value);
                  setUpdateForm(prod || {});
                }}
                required
              >
                <option value="">Select...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {updateId && (
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
                  <label>Image URL</label>
                  <input
                    name="imageUrl"
                    type="text"
                    className="form-control"
                    value={updateForm.imageUrl || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, imageUrl: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label>Price</label>
                  <input
                    name="price"
                    type="number"
                    className="form-control"
                    value={updateForm.price || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, price: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label>Description</label>
                  <input
                    name="description"
                    type="text"
                    className="form-control"
                    value={updateForm.description || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}
            <button type="submit" className="btn btn-warning">
              Update Product
            </button>
          </form>
        </div>
      )}

      {/* Delete Product */}
      {activeTab === "deleteProduct" && (
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500 }}>
          <h4>Delete Product</h4>
          <form onSubmit={handleDeleteProduct}>
            <div className="mb-3">
              <label>Select Product</label>
              <select
                className="form-select"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                required
              >
                <option value="">Select...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}
            <button type="submit" className="btn btn-danger">
              Delete Product
            </button>
          </form>
        </div>
      )}

      {/* Orders & Users */}
      {activeTab === "orders" && (
        <div className="card p-4 shadow-sm">
          <div className="mb-3 d-flex gap-2">
            <button
              className={`btn btn-outline-primary${
                showOrders ? " active" : ""
              }`}
              onClick={() => {
                setShowOrders(true);
                setShowUsers(false);
              }}
            >
              Show All Orders
            </button>
            <button
              className={`btn btn-outline-secondary${
                showUsers ? " active" : ""
              }`}
              onClick={() => {
                setShowOrders(false);
                setShowUsers(true);
              }}
            >
              Show All Users
            </button>
          </div>
          {/* Orders Table */}
          {showOrders && (
            <>
              <h4>All Orders for This Restaurant</h4>
              {ordersLoading ? (
                <div>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div>No orders found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Order ID</th>
                        <th>Products</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Order Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.user?.userName || "N/A"}</td>
                          <td>{order.user?.email || "N/A"}</td>
                          <td>{order._id}</td>
                          <td>
                            <ul className="mb-0">
                              {order.products.map((p, idx) => (
                                <li
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {p.product?.imageUrl && (
                                    <img
                                      src={p.product.imageUrl}
                                      alt={p.product?.name}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                        marginRight: 8,
                                      }}
                                    />
                                  )}
                                  {p.product?.name || p.product} x {p.quantity}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>₹{order.totalAmount}</td>
                          <td>{order.status}</td>
                          <td>{new Date(order.orderDate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {/* Users Table */}
          {showUsers && (
            <>
              <h4>All Users Who Ordered</h4>
              {users.length === 0 ? (
                <div>No users found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
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
            </>
          )}
        </div>
      )}

      {/* All Reviews */}
      {activeTab === "reviews" && (
        <div className="card p-4 shadow-sm">
          <h4>All Reviews for My Products</h4>
          {reviews.length === 0 ? (
            <div>No reviews found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Product Image</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r._id}>
                      <td>{r.product?.name || "N/A"}</td>
                      <td>
                        <img
                          src={r.product?.imageUrl}
                          alt={r.product?.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </td>
                      <td>{r.user?.userName || "N/A"}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment}</td>
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