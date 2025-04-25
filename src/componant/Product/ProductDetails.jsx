import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/ProductDetails.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetails({ handleAddToCart, handleAddToWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isInStock, setIsInStock] = useState(true);
  const [dishes, setDishes] = useState([]);

  // ✅ Function to fetch product from backend
  const fetchProductFromBackend = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product from backend');
      }
      const data = await response.json();
      setProduct(data);
      setMainImage(data.imageUrl);
      setIsInStock(data.stock > 0);

      const allProductsResponse = await fetch('http://localhost:8081/api/products');
      const allProducts = await allProductsResponse.json();

      const related = allProducts.filter(
        (item) => item.category === data.category && item.id !== data.id
      );
      setRelatedProducts(related.slice(0, 4));
      setDishes(data); // Set the fetched data to state

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProductFromBackend();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCartClick = (productToAdd = product, quantityToAdd = quantity) => {
    if (productToAdd) {
      handleAddToCart({ ...productToAdd, quantity: quantityToAdd });
      toast.success(`${productToAdd.name} (${quantityToAdd}x) added to cart!`);
    }
  };

  const handleAddToWishlistClick = (productToAdd = product) => {
    if (productToAdd) {
      handleAddToWishlist(productToAdd);
      toast.info(`${productToAdd.name} added to wishlist!`);
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        })
        .then(() => toast.success('Product shared successfully!'))
        .catch(() => toast.error('Failed to share product.'));
    } else {
      toast.info('Sharing is not supported in your browser.');
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/products/${relatedProductId}`); // Ensure this matches the route in App.jsx
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details-container">
      <div className="product-images">
        <div className="main-image-container">
          <img
            src={mainImage}
            alt={product.name}
            className="main-image"
            onMouseEnter={(e) => e.currentTarget.classList.add('zoomed')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('zoomed')}
            loading="lazy"
          />
          {product.discount && <span className="discount-badge">{product.discount}% OFF</span>}
        </div>
        <div className="thumbnail-grid">
          {product.thumbnails?.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${mainImage === thumbnail ? 'active' : ''}`}
              onClick={() => setMainImage(thumbnail)}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="product-rating">
          <span>Rating: </span>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>★</span>
          ))}
        </div>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        {product.discount && (
          <p className="original-price">
            Original Price: <s>${(product.price / (1 - product.discount / 100)).toFixed(2)}</s>
          </p>
        )}
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCartClick} disabled={!isInStock}>
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button
            className="order-now-btn"
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
              if (product.id) {
                navigate(`/order/${product.id}`);
              } else {
                toast.error('Unable to navigate to order page. Product ID is missing.');
              }
            }}
          >
            Order Now
          </button>
          <button className="share-btn" onClick={handleShareProduct}>Share</button>
        </div>
        <div className="product-reviews">
          <h3>Reviews</h3>
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p className="review-author">{review.author}</p>
                <p className="review-text">{review.text}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

      <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="related-product"
              onClick={() => handleRelatedProductClick(relatedProduct.id)}
            >
              <img src={relatedProduct.imageUrl} alt={relatedProduct.name} loading="lazy" />
              <p>{relatedProduct.name}</p>
              <p>${relatedProduct.price.toFixed(2)}</p>
              <div className="related-product-actions">
                <button
                  className="success"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when adding to cart
                    handleAddToCart(relatedProduct);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="card-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when ordering
                    navigate(`/order/${relatedProduct.id}`);
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ProductDetails;

