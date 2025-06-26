import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Clock, 
  Eye,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, productsAPI } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  reviewCount: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  deliveryAddress: any;
  notes?: string;
}

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'analytics'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'other',
    isAvailable: true,
    preparationTime: 15,
    rating: 0,
    reviewCount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const productCategories = [
    'pizza',
    'burger',
    'chinese',
    'indian',
    'dessert',
    'drinks',
    'italian',
    'mexican',
    'thai',
    'other'
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        ordersAPI.getRestaurantOrders(),
        productsAPI.getAll()
      ]);

      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);

      const totalRevenue = ordersRes.data.orders?.reduce((sum: number, order: Order) => 
        order.status === 'delivered' ? sum + order.total : sum, 0) || 0;
      const pendingOrders = ordersRes.data.orders?.filter((order: Order) => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)).length || 0;
      const avgRating = productsRes.data.products?.reduce((sum: number, product: Product) => 
        sum + product.rating, 0) / productsRes.data.products?.length || 0;

      setStats({
        totalOrders: ordersRes.data.orders?.length || 0,
        totalRevenue,
        totalProducts: productsRes.data.products?.length || 0,
        pendingOrders,
        avgRating: Math.round(avgRating * 10) / 10
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setSuccess('Order status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const handleCreateProduct = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description) {
        throw new Error('Name, price, category and description are required');
      }

      const response = await productsAPI.create(newProduct as Product);
      if (response.data.success) {
        setSuccess('Product created successfully');
        setTimeout(() => setSuccess(''), 3000);
        await loadDashboardData();
        setShowProductModal(false);
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          image: '',
          category: 'other',
          isAvailable: true,
          preparationTime: 15,
          rating: 0,
          reviewCount: 0
        });
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await productsAPI.update(editingProduct._id, editingProduct);
      if (response.data.success) {
        setSuccess('Product updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        await loadDashboardData();
        setEditingProduct(null);
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await productsAPI.delete(productId);
        if (response.data.success) {
          setSuccess('Product deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
          await loadDashboardData();
        } else {
          throw new Error(response.data.message || 'Failed to delete product');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm', status: 'confirmed', color: 'bg-blue-500' },
          { label: 'Cancel', status: 'cancelled', color: 'bg-red-500' }
        ];
      case 'confirmed':
        return [
          { label: 'Start Preparing', status: 'preparing', color: 'bg-orange-500' }
        ];
      case 'preparing':
        return [
          { label: 'Ready', status: 'ready', color: 'bg-purple-500' }
        ];
      case 'ready':
        return [
          { label: 'Out for Delivery', status: 'out_for_delivery', color: 'bg-indigo-500' }
        ];
      case 'out_for_delivery':
        return [
          { label: 'Delivered', status: 'delivered', color: 'bg-green-500' }
        ];
      default:
        return [];
    }
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+18%'
    },
    {
      title: 'Products',
      value: stats.totalProducts.toString(),
      icon: Store,
      color: 'bg-purple-500',
      change: '+3'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'bg-orange-500',
      change: '+2'
    },
    {
      title: 'Avg Rating',
      value: stats.avgRating.toString(),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.1'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your {user?.restaurantName || 'restaurant'}</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'orders', label: 'Orders', icon: ShoppingBag },
                { key: 'products', label: 'Products', icon: Store },
                { key: 'analytics', label: 'Analytics', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{order.user?.name} • ${order.total.toFixed(2)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <img 
                          src={product.image || '/placeholder-food.jpg'} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Orders</h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          {order.items.length} items • Total: ${order.total.toFixed(2)}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Notes:</span> {order.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {getStatusActions(order.status).map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleOrderStatusUpdate(order._id, action.status)}
                            className={`px-3 py-1 text-xs font-medium text-white rounded ${action.color} hover:opacity-90`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={product.image || '/placeholder-food.jpg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.preparationTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
                  <p className="text-gray-600">
                    Detailed analytics and insights about your restaurant performance will be available here.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedOrder.user?.name}</p>
                  <p className="text-sm text-gray-600">Email: {selectedOrder.user?.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedOrder.user?.phone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span className="text-sm">{item.quantity}x {item.name}</span>
                      <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {(showProductModal || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input
                      type="text"
                      value={editingProduct?.name || newProduct.name || ''}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, name: e.target.value})
                        : setNewProduct({...newProduct, name: e.target.value})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <input
                      type="number"
                      value={editingProduct?.price || newProduct.price || 0}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})
                        : setNewProduct({...newProduct, price: parseFloat(e.target.value)})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      value={editingProduct?.category || newProduct.category || 'other'}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, category: e.target.value})
                        : setNewProduct({...newProduct, category: e.target.value})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      {productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                    <input
                      type="number"
                      value={editingProduct?.preparationTime || newProduct.preparationTime || 15}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, preparationTime: parseInt(e.target.value)})
                        : setNewProduct({...newProduct, preparationTime: parseInt(e.target.value)})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      min="5"
                      max="120"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                      value={editingProduct?.description || newProduct.description || ''}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, description: e.target.value})
                        : setNewProduct({...newProduct, description: e.target.value})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={3}
                      placeholder="Product description"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
                    <input
                      type="text"
                      value={editingProduct?.image || newProduct.image || ''}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, image: e.target.value})
                        : setNewProduct({...newProduct, image: e.target.value})
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingProduct?.isAvailable ?? newProduct.isAvailable ?? true}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, isAvailable: e.target.checked})
                          : setNewProduct({...newProduct, isAvailable: e.target.checked})
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Available</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;