// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartCount, 
    cartTotal 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Generate comma-separated product IDs from cart
    const productIds = cart.map(item => item._id).join(',');
    
    // Navigate to order page with product IDs in URL and cart data in state
    navigate(`/order/${productIds}`, { 
      state: { 
        cartItems: cart,
        cartTotal: cartTotal,
        deliveryFee: 49,
        total: cartTotal + 49
      } 
    });
  };

  if (cartCount === 0) {
    return (
      <Container className="py-5 text-center">
        <FaShoppingCart size={48} className="mb-4 text-muted" />
        <h3>Your cart is empty</h3>
        <p className="text-muted mb-4">Looks like you haven't added any items yet</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Your Cart ({cartCount} items)</h2>
        <Button variant="outline-danger" size="sm" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <Row>
        <Col md={8}>
          {cart.map((item) => (
            <Card key={item._id} className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={3} md={2}>
                    <img
                      src={item.imageUrl || item.image || '/placeholder-food.jpg'}
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col xs={9} md={10}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="text-muted mb-2">₹{item.price}</p>
                        <small className="text-muted">
                          Restaurant: {item.restaurant?.name || 'N/A'}
                        </small>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, e)}
                        style={{ width: '70px' }}
                        className="me-3"
                      />
                      <div className="ms-auto fw-bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <Card.Title className="mb-4">Order Summary</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>₹49.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold">₹{(cartTotal + 49).toFixed(2)}</span>
              </div>
              <Button 
                variant="primary" 
                className="w-100 mb-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => navigate('/')}
              >
                <FaArrowLeft className="me-2" />
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;