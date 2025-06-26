import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ShoppingCart, ArrowRight, Search, Filter, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  restaurant?: {
    _id: string;
    name?: string;
    restaurantName?: string;
    restaurantAddress?: string;
  };
  rating?: number;
  preparationTime?: number;
  isAvailable?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  specialInstructions: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cart and order states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'chinese', name: 'Chinese', icon: '🥡' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];

  useEffect(() => {
    loadProducts();
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load user's default address if logged in
    if (user) {
      setDeliveryAddress(user.address || '');
      setContactPhone(user.phone || '');
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data || []);
      setTotalPages(1); // Adjust if you implement pagination in backend
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally implement search with backend
    // For now, just filter locally
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          product,
          quantity: 1,
          specialInstructions: ''
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const updateSpecialInstructions = (productId: string, instructions: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  const calculateCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: 'checkout' } });
      return;
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }

    if (!deliveryAddress) {
      setOrderError('Please enter a delivery address');
      return;
    }

    if (!contactPhone) {
      setOrderError('Please enter a contact phone number');
      return;
    }

    try {
      setOrderError('');
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        deliveryAddress,
        contactPhone,
        notes: orderNotes
      };

      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/orders/create`,
        orderData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      );

      setOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);

      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error: any) {
      console.error('Order error:', error);
      setOrderError(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ...UI code remains the same... */}
      {/* Replace products.map with filteredProducts.map */}
      {/* ... */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, restaurants, or cuisines..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full focus:border-primary-500 focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <button className="flex items-center text-gray-600 hover:text-primary-600">
              <Filter className="w-4 h-4 mr-1" />
              <span>Filter</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.imageUrl || product.image || '/placeholder-food.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.isAvailable === false && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Currently Unavailable</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <span className="font-bold text-primary-600">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm">{product.rating?.toFixed(1) ?? '4.5'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{product.preparationTime ?? 20} min</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{product.restaurant?.restaurantName || product.restaurant?.name || 'Restaurant'}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={product.isAvailable === false}
                      onClick={() => addToCart(product)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                        product.isAvailable !== false
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.isAvailable !== false ? 'Add to Cart' : 'Unavailable'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        {/* ...rest of your UI code remains unchanged... */}
      </main>
      {/* ...rest of your component remains unchanged... */}
    </div>
  );
};

export default Home;