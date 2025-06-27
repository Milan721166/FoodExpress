import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";

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

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={product.imageUrl || product.image || "/placeholder-food.jpg"}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-primary mb-3">₹{product.price}</h4>
          <div className="mb-2">
            <strong>Restaurant:</strong> {product.restaurant?.name || "N/A"}
          </div>
          <div className="mb-2">
            <strong>Type:</strong> {product.restaurant?.resturantType || "N/A"}
          </div>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate(`/order/${product._id}`)}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
