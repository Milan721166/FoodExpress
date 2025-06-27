import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import "../css/OrderPage.css"; // New CSS file for this component

const OrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", color: "" });
  const [latestOrder, setLatestOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  useEffect(() => {
    // Check for saved theme preference
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchLatestOrder();
    // eslint-disable-next-line
  }, [productId]);

  // Fetch latest order for this product and user
  const fetchLatestOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userOrders = res.data || [];
      const order = userOrders
        .filter((o) =>
          o.products.some(
            (p) =>
              p.product === productId ||
              p.product?._id === productId ||
              p.product === product?._id
          )
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      setLatestOrder(order);
    } catch (err) {
      setLatestOrder(null);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        show: true,
        message: "Please login to order.",
        color: "danger",
      });
      setTimeout(() => setToast({ show: false }), 2000);
      navigate("/login");
      return;
    }
    try {
      const restaurantId =
        typeof product.restaurant === "string"
          ? product.restaurant
          : product.restaurant?._id;

      const orderData = {
        restaurant: restaurantId,
        products: [{ product: product._id, quantity }],
        totalAmount: product.price * quantity,
      };
      await axios.post(`${BACKEND_URL}/orders/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        show: true,
        message: "Order created successfully!",
        color: "success",
      });
      fetchLatestOrder();
      setTimeout(() => {
        setToast({ show: false });
        navigate("/"); // <-- This will redirect to home after 2 seconds
      }, 2000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order failed.",
        color: "danger",
      });
      setTimeout(() => setToast({ show: false }), 2000);
    }
  };

  // Update order within 10 minutes
  const handleUpdateOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token || !latestOrder) return;
    try {
      await axios.put(
        `${BACKEND_URL}/orders/${latestOrder._id}`,
        {
          products: [{ product: product._id, quantity }],
          totalAmount: product.price * quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({
        show: true,
        message: "Order updated successfully!",
        color: "success",
      });
      fetchLatestOrder();
      setTimeout(() => setToast({ show: false }), 2000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order update failed.",
        color: "danger",
      });
      setTimeout(() => setToast({ show: false }), 2000);
    }
  };

  // Delete order within 30 minutes
  const handleDeleteOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token || !latestOrder) return;
    try {
      await axios.delete(`${BACKEND_URL}/orders/${latestOrder._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        show: true,
        message: "Order deleted successfully!",
        color: "success",
      });
      setLatestOrder(null);
      setTimeout(() => setToast({ show: false }), 2000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order delete failed.",
        color: "danger",
      });
      setTimeout(() => setToast({ show: false }), 2000);
    }
  };

  if (loading)
    return (
      <div className={`container py-5 text-center ${darkMode ? 'dark-mode' : ''}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className={`container py-5 text-center ${darkMode ? 'dark-mode' : ''}`}>
        <div className="not-found-animation">
          <h4>Product not found</h4>
          <div className="animation-container">
            <div className="sad-face">:(</div>
          </div>
        </div>
      </div>
    );

  // Time logic for update/delete
  let canUpdate = false;
  let canDelete = false;
  if (latestOrder && latestOrder.createdAt) {
    const created = new Date(latestOrder.createdAt);
    const now = new Date();
    const diffMinutes = (now - created) / 60000;
    canUpdate = diffMinutes <= 10;
    canDelete = diffMinutes <= 30;
  }

  return (
    <div className={`container py-5 order-page-container ${darkMode ? 'dark-mode' : ''}`} style={{ maxWidth: 600 }}>
      <div className="theme-toggle-container">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <h2 className="mb-4 animate-fade-in">Order Product</h2>
      <div className="card p-4 shadow-sm animate-slide-up">
        <div className="d-flex align-items-center mb-3">
          <img
            src={product.imageUrl || product.image || "/placeholder-food.jpg"}
            alt={product.name}
            className="product-image"
          />
          <div className="product-details">
            <h5 className="product-name">{product.name}</h5>
            <div className="text-muted product-description">{product.description}</div>
            <div className="product-info">
              <strong>Restaurant:</strong> {product.restaurant?.name || "N/A"}
            </div>
            <div className="product-info">
              <strong>Price:</strong> ₹{product.price}
            </div>
          </div>
        </div>
        <form onSubmit={handleOrder}>
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control quantity-input"
              style={{ maxWidth: 120 }}
              required
            />
          </div>
          <div className="mb-3 total-amount">
            <strong>Total: ₹{product.price * quantity}</strong>
          </div>
          <button type="submit" className="btn btn-success w-100 order-btn">
            {orderLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
        {latestOrder && (
          <div className="mt-3 order-actions animate-fade-in">
            {canUpdate && (
              <button
                className="btn btn-warning me-2 update-btn"
                onClick={handleUpdateOrder}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Update Order"
                )}
              </button>
            )}
            {canDelete && (
              <button
                className="btn btn-danger delete-btn"
                onClick={handleDeleteOrder}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Delete Order"
                )}
              </button>
            )}
          </div>
        )}
      </div>
      {toast.show && (
        <div
          className={`toast align-items-center text-white bg-${toast.color} border-0 show position-fixed bottom-0 end-0 m-4 animate-toast`}
          role="alert"
          style={{ zIndex: 9999, minWidth: 250 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => setToast({ show: false })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;