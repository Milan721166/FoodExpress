import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Utensils, Star, TrendingUp, CheckCircle, XCircle, Clock, User, Package, Home, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  averageRating: number;
  pendingRestaurants: number;
  todayRevenue: number;
  activeUsers: number;
}

interface Restaurant {
  _id: string;
  restaurantName: string;
  cuisine: string;
  restaurantAddress: string;
  isApproved: boolean;
  createdAt: string;
  role: string;
}

interface Order {
  _id: string;
  user: {
    name?: string;
    email?: string;
  };
  restaurant: {
    restaurantName?: string;
  };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: string;
}

interface Review {
  _id: string;
  user: {
    name?: string;
    email?: string;
  };
  restaurant: {
    restaurantName?: string;
  };
  product?: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    averageRating: 0,
    pendingRestaurants: 0,
    todayRevenue: 0,
    activeUsers: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'restaurants' | 'reviews'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch all data in parallel
      const [restaurantsRes, ordersRes, reviewsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/api/restaurants', { headers, credentials: 'include' }),
        fetch('http://localhost:3001/api/admin/orders', { headers, credentials: 'include' }),
        fetch('http://localhost:3001/api/admin/reviews', { headers, credentials: 'include' }),
        fetch('http://localhost:3001/api/admin/users', { headers, credentials: 'include' })
      ]);

      // Process responses
      const restaurantsData = await restaurantsRes.json();
      const ordersData = await ordersRes.json();
      const reviewsData = await reviewsRes.json();
      const usersData = await usersRes.json();

      const actualRestaurants = restaurantsData.data || restaurantsData;
      const actualOrders = ordersData.data || ordersData;
      const actualReviews = reviewsData.data || reviewsData;
      const actualUsers = usersData.data || usersData;

      setRestaurants(actualRestaurants);
      setOrders(actualOrders);
      setReviews(actualReviews);
      setUsers(actualUsers);

      // Calculate statistics
      const today = new Date();
      const todayOrders = actualOrders.filter((order: Order) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });

      const todayRevenue = todayOrders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
      const avgRating = actualReviews.length > 0
        ? actualReviews.reduce((sum: number, review: Review) => sum + (review.rating || 0), 0) / actualReviews.length
        : 0;
      
      const pendingRestaurants = actualRestaurants.filter((r: Restaurant) => r.role === 'restaurant' && !r.isApproved).length;
      const activeUsers = actualUsers.filter((u: any) => {
        if (!u.lastLogin) return false;
        const lastLogin = new Date(u.lastLogin);
        return lastLogin > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }).length;

      setStats({
        totalUsers: actualUsers.length,
        totalRestaurants: actualRestaurants.filter((r: Restaurant) => r.role === 'restaurant').length,
        totalOrders: actualOrders.length,
        averageRating: avgRating,
        pendingRestaurants,
        todayRevenue,
        activeUsers
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRestaurant = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      } : { 'Content-Type': 'application/json' };

      const response = await fetch(`http://localhost:3001/api/admin/restaurants/${userId}/approve`, {
        method: 'PATCH',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to approve restaurant');
      }

      loadDashboardData();
    } catch (error) {
      console.error('Error approving restaurant:', error);
      setError('Failed to approve restaurant. Please try again.');
    }
  };

  const handleRejectRestaurant = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      } : { 'Content-Type': 'application/json' };

      const response = await fetch(`http://localhost:3001/api/admin/restaurants/${userId}/reject`, {
        method: 'PATCH',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to reject restaurant');
      }

      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      setError('Failed to reject restaurant. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      
      await fetch(`http://localhost:3001/api/users/${userId}`, { 
        method: 'DELETE', 
        headers, 
        credentials: 'include' 
      });
      
      setUsers(users.filter(u => u._id !== userId));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Stats cards for overview
  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: User,
      color: 'bg-blue-500'
    },
    { 
      title: 'Total Restaurants', 
      value: stats.totalRestaurants, 
      icon: Home,
      color: 'bg-green-500'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: Package,
      color: 'bg-purple-500'
    },
    { 
      title: "Today's Revenue", 
      value: `$${stats.todayRevenue.toFixed(2)}`, 
      icon: ShoppingBag,
      color: 'bg-yellow-500'
    },
    { 
      title: 'Pending Approvals', 
      value: stats.pendingRestaurants, 
      icon: Clock,
      color: 'bg-orange-500'
    },
    { 
      title: 'Avg. Rating', 
      value: stats.averageRating.toFixed(1), 
      icon: Star,
      color: 'bg-pink-500'
    },
    { 
      title: 'Active Users (30d)', 
      value: stats.activeUsers, 
      icon: Users,
      color: 'bg-indigo-500'
    },
    { 
      title: 'Total Reviews', 
      value: reviews.length, 
      icon: MessageSquare,
      color: 'bg-red-500'
    }
  ];

  // Recent data for overview
  const recentOrders = orders.slice(0, 5);
  const pendingRestaurantsList = restaurants.filter(r => r.role === 'restaurant' && !r.isApproved).slice(0, 5);
  const recentReviews = reviews.slice(0, 5);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }


  // Renderers
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-blue-500" />
            Recent Orders
          </h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders</p>
            ) : (
              recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order._id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {order.restaurant?.restaurantName || 'Unknown'} • ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {pendingRestaurantsList.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending approvals</p>
            ) : (
              pendingRestaurantsList.map(restaurant => (
                <div key={restaurant._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.restaurantName}</p>
                    <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRestaurant(restaurant._id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectRestaurant(restaurant._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Reviews
          </h3>
          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent reviews</p>
            ) : (
              recentReviews.map(review => (
                <div key={review._id} className="py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-gray-800 mb-1 text-sm">{review.comment || 'No comment'}</p>
                  <p className="text-xs text-gray-500">
                    by {review.user?.name || 'Anonymous'} • {review.restaurant?.restaurantName || 'Unknown'}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
        <Users className="w-5 h-5 mr-2 text-blue-500" />
        User Management
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'restaurant' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      {user.role === 'restaurant' && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2 text-purple-500" />
        Order Management
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No orders found</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.restaurant?.restaurantName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderRestaurants = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
        <Utensils className="w-5 h-5 mr-2 text-green-500" />
        Restaurant Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">No restaurants found</div>
        ) : (
          restaurants.map(restaurant => (
            <motion.div
              key={restaurant._id}
              whileHover={{ y: -5 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">{restaurant.restaurantName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    !restaurant.isApproved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {!restaurant.isApproved ? 'Pending' : 'Approved'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Cuisine:</span> {restaurant.cuisine}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  <span className="font-medium">Address:</span> {restaurant.restaurantAddress}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(restaurant.createdAt).toLocaleDateString()}
                  </span>
                  
                  {!restaurant.isApproved && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveRestaurant(restaurant._id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRestaurant(restaurant._id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderReviews = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
        <Star className="w-5 h-5 mr-2 text-yellow-500" />
        Review Management
      </h2>
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No reviews found</div>
        ) : (
          reviews.map(review => (
            <motion.div 
              key={review._id}
              whileHover={{ scale: 1.01 }}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                  </div>
                  <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{review.restaurant?.restaurantName || 'Unknown'}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 mb-2">{review.comment || 'No comment provided'}</p>
              {review.product && (
                <p className="text-xs text-gray-500">
                  Product: {review.product.name}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your platform data and analytics</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4 overflow-x-auto pb-2">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'orders', label: 'Orders', icon: ShoppingBag },
              { key: 'restaurants', label: 'Restaurants', icon: Utensils },
              { key: 'reviews', label: 'Reviews', icon: Star }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'restaurants' && renderRestaurants()}
          {activeTab === 'reviews' && renderReviews()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;