// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../utils/api";

// const UserProfile = () => {
//   const [orders, setOrders] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", color: "" });
//   const [loading, setLoading] = useState(true);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
// const [showDeleteModal, setShowDeleteModal] = useState(false);
// const [selectedOrder, setSelectedOrder] = useState(null);
// const [updateQuantity, setUpdateQuantity] = useState(1);

//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setOrders([]);
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get(`${BACKEND_URL}/orders/myorders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOrders(res.data || []);
//     } catch (err) {
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update order
//   const handleUpdateOrder = async (order) => {
//     setOrderLoading(true);
//     const token = localStorage.getItem("token");
//     try {
//       // For demo: just increment quantity of first product by 1
//       const updatedProducts = order.products.map((p, idx) =>
//         idx === 0 ? { ...p, quantity: p.quantity + 1 } : p
//       );
//       const totalAmount = updatedProducts.reduce(
//         (sum, p) => sum + (p.product.price || 0) * p.quantity,
//         0
//       );
//       await axios.put(
//         `${BACKEND_URL}/orders/${order._id}`,
//         {
//           products: updatedProducts.map((p) => ({
//             product: typeof p.product === "string" ? p.product : p.product._id,
//             quantity: p.quantity,
//           })),
//           totalAmount,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setToast({
//         show: true,
//         message: "Order updated successfully!",
//         color: "success",
//       });
//       fetchOrders();
//     } catch (err) {
//       setToast({
//         show: true,
//         message: err.response?.data?.message || "Order update failed.",
//         color: "danger",
//       });
//     } finally {
//       setOrderLoading(false);
//       setTimeout(() => setToast({ show: false }), 2000);
//     }
//   };

//   // Delete order
//   const handleDeleteOrder = async (orderId) => {
//     setOrderLoading(true);
//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(`${BACKEND_URL}/orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setToast({
//         show: true,
//         message: "Order deleted successfully!",
//         color: "success",
//       });
//       fetchOrders();
//     } catch (err) {
//       setToast({
//         show: true,
//         message: err.response?.data?.message || "Order delete failed.",
//         color: "danger",
//       });
//     } finally {
//       setOrderLoading(false);
//       setTimeout(() => setToast({ show: false }), 2000);
//     }
//   };

//   // Time logic for update/delete
//   const getTimeFlags = (createdAt) => {
//     if (!createdAt) return { canUpdate: false, canDelete: false };
//     const created = new Date(createdAt);
//     const now = new Date();
//     const diffMinutes = (now - created) / 60000;
//     return {
//       canUpdate: diffMinutes <= 10,
//       canDelete: diffMinutes <= 30,
//     };
//   };

//   return (
//     <div className="container py-5">
//       <h2 className="mb-4">My Orders</h2>
//       {loading ? (
//         <div>Loading...</div>
//       ) : orders.length === 0 ? (
//         <div>No orders found.</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Product(s)</th>
//                 <th>Restaurant</th>
//                 <th>Quantity</th>
//                 <th>Total Amount</th>
//                 <th>Status</th>
//                 <th>Order Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, idx) => {
//                 const { canUpdate, canDelete } = getTimeFlags(order.createdAt);
//                 return (
//                   <tr key={order._id}>
//                     <td>{idx + 1}</td>
//                     <td>
//                       {order.products.map((p, i) => (
//                         <div key={i}>
//                           {typeof p.product === "object"
//                             ? p.product.name
//                             : p.product}
//                         </div>
//                       ))}
//                     </td>
//                     <td>
//                       {order.restaurant?.name ||
//                         order.restaurant?.restaurantName ||
//                         "N/A"}
//                     </td>
//                     <td>
//                       {order.products.map((p, i) => (
//                         <div key={i}>{p.quantity}</div>
//                       ))}
//                     </td>
//                     <td>₹{order.totalAmount}</td>
//                     <td>{order.status || "Pending"}</td>
//                     <td>
//                       {order.createdAt
//                         ? new Date(order.createdAt).toLocaleString()
//                         : "N/A"}
//                     </td>
//                     <td>
//                       {canUpdate && (
//                         <button
//                           className="btn btn-warning btn-sm me-2"
//                           onClick={() => handleUpdateOrder(order)}
//                           disabled={orderLoading}
//                         >
//                           Update
//                         </button>
//                       )}
//                       {canDelete && (
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => handleDeleteOrder(order._id)}
//                           disabled={orderLoading}
//                         >
//                           Delete
//                         </button>

//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {toast.show && (
//         <div
//           className={`toast align-items-center text-white bg-${toast.color} border-0 show position-fixed bottom-0 end-0 m-4`}
//           role="alert"
//           style={{ zIndex: 9999, minWidth: 250 }}
//         >
//           <div className="d-flex">
//             <div className="toast-body">{toast.message}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";

const UserProfile = () => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", color: "" });
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${BACKEND_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Update order with quantity from modal
  const handleUpdateOrder = async (order, quantity) => {
    setOrderLoading(true);
    const token = localStorage.getItem("token");
    try {
      const updatedProducts = order.products.map((p, idx) =>
        idx === 0 ? { ...p, quantity } : p
      );
      const totalAmount = updatedProducts.reduce(
        (sum, p) => sum + (p.product.price || 0) * p.quantity,
        0
      );
      await axios.put(
        `${BACKEND_URL}/orders/${order._id}`,
        {
          products: updatedProducts.map((p) => ({
            product: typeof p.product === "string" ? p.product : p.product._id,
            quantity: p.quantity,
          })),
          totalAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({
        show: true,
        message: "Order updated successfully!",
        color: "success",
      });
      fetchOrders();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order update failed.",
        color: "danger",
      });
    } finally {
      setOrderLoading(false);
      setTimeout(() => setToast({ show: false }), 2000);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    setOrderLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BACKEND_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        show: true,
        message: "Order deleted successfully!",
        color: "success",
      });
      fetchOrders();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order delete failed.",
        color: "danger",
      });
    } finally {
      setOrderLoading(false);
      setTimeout(() => setToast({ show: false }), 2000);
    }
  };

  // Time logic for update/delete
  const getTimeFlags = (createdAt) => {
    if (!createdAt) return { canUpdate: false, canDelete: false };
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = (now - created) / 60000;
    return {
      canUpdate: diffMinutes <= 10,
      canDelete: diffMinutes <= 30,
    };
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product(s)</th>
                <th>Restaurant</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const { canUpdate, canDelete } = getTimeFlags(order.createdAt);
                return (
                  <tr key={order._id}>
                    <td>{idx + 1}</td>
                    <td>
                      {order.products.map((p, i) => (
                        <div key={i}>
                          {typeof p.product === "object"
                            ? p.product.name
                            : p.product}
                        </div>
                      ))}
                    </td>
                    <td>
                      {order.restaurant?.name ||
                        order.restaurant?.restaurantName ||
                        "N/A"}
                    </td>
                    <td>
                      {order.products.map((p, i) => (
                        <div key={i}>{p.quantity}</div>
                      ))}
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.status || "Pending"}</td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {canUpdate && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setUpdateQuantity(order.products[0]?.quantity || 1);
                            setShowUpdateModal(true);
                          }}
                          disabled={orderLoading}
                        >
                          Update
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDeleteModal(true);
                          }}
                          disabled={orderLoading}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>Quantity:</label>
                <input
                  type="number"
                  min={1}
                  value={updateQuantity}
                  onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await handleUpdateOrder(selectedOrder, updateQuantity);
                    setShowUpdateModal(false);
                  }}
                  disabled={orderLoading}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this order?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await handleDeleteOrder(selectedOrder._id);
                    setShowDeleteModal(false);
                  }}
                  disabled={orderLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`toast align-items-center text-white bg-${toast.color} border-0 show position-fixed bottom-0 end-0 m-4`}
          role="alert"
          style={{ zIndex: 9999, minWidth: 250 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
