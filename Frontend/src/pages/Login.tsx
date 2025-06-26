import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
  role: 'user' | 'restaurant' | 'admin';
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormData>();

  const selectedRole = watch('role', 'user');

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password, data.role);
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User', icon: User, description: 'Order food and manage your account' },
    { value: 'restaurant', label: 'Restaurant', icon: Store, description: 'Manage your restaurant and orders' },
    { value: 'admin', label: 'Admin', icon: Shield, description: 'System administration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Login as:</label>
            <div className="grid grid-cols-1 gap-2">
              {roleOptions.map((option) => (
                <label key={option.value} className="relative">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('role', { required: 'Please select a role' })}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    selectedRole === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center">
                      <option.icon className={`w-5 h-5 mr-3 ${
                        selectedRole === option.value ? 'text-primary-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          selectedRole === option.value ? 'text-primary-700' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="input-field pl-10"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full btn-secondary py-3 text-lg font-medium text-center block"
          >
            Create Account
          </Link>
        </form>

        {/* Admin Note */}
        {selectedRole === 'admin' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-700">
                Admin credentials are configured via environment variables for security.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;