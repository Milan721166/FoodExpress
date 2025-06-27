import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { FaArrowLeft, FaTag, FaStore } from "react-icons/fa";
import "../css/product.css"

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="container py-5 text-center">Loading...</div>;
  if (!product)
    return <div className="container py-5 text-center">Product not found.</div>;

  // Mock discount data
  const discounts = [
    { code: "SAVE10", value: 10, description: "10% off on all orders" },
    { code: "FIRST15", value: 15, description: "15% off for first order" },
    { code: "SPECIAL20", value: 20, description: "20% off special offer" }
  ];

  const originalPrice = product.price;
  const discountedPrice = Math.round(originalPrice * 0.9); // 10% discount for example

  return (
    <div className="product-detail-container">
      <div className="product-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="product-content">
        <div className="product-image-container">
          <img
            src={product.imageUrl || product.image || "/placeholder-food.jpg"}
            alt={product.name}
            className="product-image"
          />
          <span className="hot-badge">Hot</span>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="price-section">
            <span className="current-price">R{discountedPrice}</span>
            <span className="original-price">R{originalPrice}</span>
            <span className="discount-badge">Save 10%</span>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <FaStore className="meta-icon" />
              <span>Restaurant: {product.restaurant?.name || "N/A"}</span>
            </div>
            <div className="meta-item">
              <FaTag className="meta-icon" />
              <span>Type: {product.restaurant?.resturantType || "N/A"}</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="offers-section">
            <h3 className="section-title">Available Offers</h3>
            {discounts.map((discount, index) => (
              <div key={index} className="offer-item">
                <strong>{discount.code}</strong>
                <p>{discount.description}</p>
              </div>
            ))}
          </div>

          <button
            className="order-button"
            onClick={() => navigate(`/order/${product._id}`)}
          >
            Order Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;