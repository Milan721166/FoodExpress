
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../utils/api";
// import "../css/UserProfile.css";
// const UserProfile = () => {
//   const [orders, setOrders] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", color: "" });
//   const [loading, setLoading] = useState(true);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [updateQuantity, setUpdateQuantity] = useState(1);

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

//   // Update order with quantity from modal
//   const handleUpdateOrder = async (order, quantity) => {
//     setOrderLoading(true);
//     const token = localStorage.getItem("token");
//     try {
//       const updatedProducts = order.products.map((p, idx) =>
//         idx === 0 ? { ...p, quantity } : p
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
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setUpdateQuantity(order.products[0]?.quantity || 1);
//                             setShowUpdateModal(true);
//                           }}
//                           disabled={orderLoading}
//                         >
//                           Update
//                         </button>
//                       )}
//                       {canDelete && (
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowDeleteModal(true);
//                           }}
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

//       {/* Update Modal */}
//       {showUpdateModal && selectedOrder && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Update Order</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowUpdateModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <label>Quantity:</label>
//                 <input
//                   type="number"
//                   min={1}
//                   value={updateQuantity}
//                   onChange={(e) => setUpdateQuantity(Number(e.target.value))}
//                   className="form-control"
//                 />
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowUpdateModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-primary"
//                   onClick={async () => {
//                     await handleUpdateOrder(selectedOrder, updateQuantity);
//                     setShowUpdateModal(false);
//                   }}
//                   disabled={orderLoading}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && selectedOrder && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Delete Order</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowDeleteModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 Are you sure you want to delete this order?
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-danger"
//                   onClick={async () => {
//                     await handleDeleteOrder(selectedOrder._id);
//                     setShowDeleteModal(false);
//                   }}
//                   disabled={orderLoading}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
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
import { 
  FaArrowLeft, 
  FaTrash, 
  FaEdit, 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaInfoCircle,
  FaBox,
  FaStore,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSpinner
} from "react-icons/fa";
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Toast } from "react-bootstrap";

const UserProfile = () => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
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
      setToast({
        show: true,
        message: err.response?.data?.message || "Failed to fetch orders",
        variant: "danger",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
        variant: "success",
      });
      fetchOrders();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order update failed.",
        variant: "danger",
      });
    } finally {
      setOrderLoading(false);
      setShowUpdateModal(false);
    }
  };

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
        variant: "success",
      });
      fetchOrders();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Order delete failed.",
        variant: "danger",
      });
    } finally {
      setOrderLoading(false);
      setShowDeleteModal(false);
    }
  };

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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge bg="success"><FaCheck /> Completed</Badge>;
      case "cancelled":
        return <Badge bg="danger"><FaTimes /> Cancelled</Badge>;
      case "processing":
        return <Badge bg="warning" text="dark"><FaSpinner className="fa-spin" /> Processing</Badge>;
      default:
        return <Badge bg="info"><FaClock /> Pending</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <FaBox className="me-2" /> My Orders
          </h2>
          <p className="text-muted">View and manage your order history</p>
        </Col>
      </Row>

      {loading ? (
        <Row className="justify-content-center my-5">
          <Col xs="auto">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading your orders...</p>
          </Col>
        </Row>
      ) : orders.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaInfoCircle size={48} className="text-muted mb-3" />
            <h4>No Orders Found</h4>
            <p className="text-muted">You haven't placed any orders yet.</p>
            <Button variant="primary" href="/">
              Browse Restaurants
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order Details</th>
                  <th>Restaurant</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
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
                        <div className="d-flex flex-column">
                          {order.products.map((p, i) => (
                            <div key={i} className="mb-1">
                              <strong>
                                {typeof p.product === "object"
                                  ? p.product.name
                                  : p.product}
                              </strong>
                              <div className="text-muted small">
                                Qty: {p.quantity} × ₹{p.product.price || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStore className="me-2 text-muted" />
                          {order.restaurant?.name ||
                            order.restaurant?.restaurantName ||
                            "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaMoneyBillWave className="me-2 text-muted" />
                          ₹{order.totalAmount}
                        </div>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-muted" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {canUpdate && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setUpdateQuantity(order.products[0]?.quantity || 1);
                                setShowUpdateModal(true);
                              }}
                              disabled={orderLoading}
                            >
                              <FaEdit /> Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDeleteModal(true);
                              }}
                              disabled={orderLoading}
                            >
                              <FaTrash /> Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" /> Update Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p className="mb-3">
                Updating: <strong>{selectedOrder.products[0]?.product?.name}</strong>
              </p>
              <div className="mb-3">
                <label className="form-label">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  value={updateQuantity}
                  onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="alert alert-info">
                New total: ₹{(selectedOrder.products[0]?.product?.price || 0) * updateQuantity}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateOrder(selectedOrder, updateQuantity)}
            disabled={orderLoading}
          >
            {orderLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Updating...</span>
              </>
            ) : (
              "Update Order"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaTrash className="me-2" /> Delete Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>Are you sure you want to delete this order?</p>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Text>
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </Card.Text>
                  <Card.Text>
                    <strong>Restaurant:</strong> {selectedOrder.restaurant?.name || "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Total:</strong> ₹{selectedOrder.totalAmount}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Alert variant="warning" className="mb-0">
                This action cannot be undone.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteOrder(selectedOrder?._id)}
            disabled={orderLoading}
          >
            {orderLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              "Delete Order"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

export default UserProfile;