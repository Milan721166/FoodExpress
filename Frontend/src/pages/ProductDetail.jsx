import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { FaArrowLeft, FaTag, FaStore } from "react-icons/fa";
import { Container, Row, Col, Button, Badge, Card, Spinner, Alert } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);
        if (res.data) {
          setProduct(res.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Oops!</Alert.Heading>
          <p>{error}</p>
          <Button variant="danger" onClick={() => navigate(-1)}>Go Back</Button>
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Product Not Found</Alert.Heading>
          <p>We couldn't find the product you're looking for.</p>
          <Button variant="primary" onClick={() => navigate(-1)}>Browse Menu</Button>
        </Alert>
      </Container>
    );
  }

  const originalPrice = product.price || 0;
  const discountedPrice = Math.round(originalPrice * 0.9);
  const hasDiscount = originalPrice > discountedPrice;
  const imageUrl = product.imageUrl || product.image || "/placeholder-food.jpg";

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        <FaArrowLeft className="me-2" /> Back
      </Button>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Img
              variant="top"
              src={imageUrl}
              alt={product.name}
              className="img-fluid"
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
              }}
            />
            {hasDiscount && (
              <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                Sale
              </Badge>
            )}
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 border-0">
            <Card.Body>
              <Card.Title as="h1" className="mb-3">{product.name}</Card.Title>
              
              <div className="d-flex align-items-center mb-3">
                {hasDiscount ? (
                  <>
                    <h3 className="text-danger me-3 mb-0">R{discountedPrice}</h3>
                    <h5 className="text-muted text-decoration-line-through mb-0">R{originalPrice}</h5>
                  </>
                ) : (
                  <h3 className="text-danger mb-0">R{originalPrice}</h3>
                )}
              </div>

              <div className="mb-4">
                <h5 className="d-flex align-items-center">
                  <FaStore className="me-2" />
                  {product.restaurant?.name || "N/A"}
                </h5>
                <p className="d-flex align-items-center text-muted mb-0">
                  <FaTag className="me-2" />
                  {product.restaurant?.resturantType || "N/A"}
                </p>
              </div>

              {product.description && (
                <Card.Text className="mb-4">
                  {product.description}
                </Card.Text>
              )}

              <div className="d-grid gap-2 d-md-flex mb-4">
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={() => navigate(`/order/${product._id || id}`)}
                >
                  Order Now
                </Button>
              </div>

              {product.discounts?.length > 0 && (
                <div className="mb-4">
                  <h5>Available Offers</h5>
                  <div className="d-flex flex-column gap-2">
                    {product.discounts.map((discount, index) => (
                      <Card key={index} className="border">
                        <Card.Body className="py-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{discount.code}</strong>
                              <p className="mb-0 text-muted small">{discount.description}</p>
                            </div>
                            <Badge bg="success">{discount.value}% OFF</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;