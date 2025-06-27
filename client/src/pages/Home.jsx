import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">All Products</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div
                className="card h-100 shadow-sm product-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={
                    product.imageUrl || product.image || "/placeholder-food.jpg"
                  }
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-truncate">
                    {product.description}
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">
                      ₹{product.price}
                    </span>
                    <button className="btn btn-outline-primary btn-sm">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-12 text-center">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
