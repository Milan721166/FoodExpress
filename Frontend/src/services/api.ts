import axios from 'axios';
import Cookies from 'js-cookie';

// Add this declaration to fix the ImportMeta typing error
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
// api.interceptors.request.use((config) => {
//   const token = Cookies.get('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: (email: string) => api.post('/auth/resend-verification', { email }),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
  getByRestaurant: (restaurantId: string) => api.get(`/products/restaurant/${restaurantId}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  // getUserOrders: () => api.get('/orders/user'),
  getUserOrders: () => api.get('/orders/allUsersOrders'),
  getRestaurantOrders: (params?: any) => api.get('/orders/restaurant', { params }),
  getAllOrders: (params?: any) => api.get('/orders/admin', { params }),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  getById: (id: string) => api.get(`/orders/${id}`),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: (params?: any) => api.get('/restaurants', { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getAllForAdmin: (params?: any) => api.get('/restaurants/admin/all', { params }),
  approve: (id: string) => api.put(`/restaurants/${id}/approve`),
  reject: (id: string, reason?: string) => api.put(`/restaurants/${id}/reject`, { reason }),
  getStats: (id: string) => api.get(`/restaurants/${id}/stats`),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData: any) => api.post('/reviews', reviewData),
  getAll: (params?: any) => api.get('/reviews', { params }),
  getByProduct: (productId: string, params?: any) => api.get(`/reviews/product/${productId}`, { params }),
  getByRestaurant: (restaurantId: string, params?: any) => api.get(`/reviews/restaurant/${restaurantId}`, { params }),
  update: (id: string, reviewData: any) => api.put(`/reviews/${id}`, reviewData),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  report: (id: string, reason: string) => api.put(`/reviews/${id}/report`, { reason }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  getAllForAdmin: (params?: any) => api.get('/users/admin/all', { params }),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/admin/stats'),
};

export default api;