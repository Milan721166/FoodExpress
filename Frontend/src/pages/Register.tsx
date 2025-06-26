import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Store, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: 'user' | 'restaurant';
  // Restaurant specific fields
  restaurantName?: string;
  restaurantAddress?: string;
  cuisine?: string;
  description?: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const selectedRole = watch('role', 'user');
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join FoodExpress today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Register as:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="relative">
                <input
                  type="radio"
                  value="user"
                  {...register('role', { required: 'Please select a role' })}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'user'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center">
                    <User className={`w-6 h-6 mr-3 ${
                      selectedRole === 'user' ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`font-medium ${
                        selectedRole === 'user' ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        User
                      </div>
                      <div className="text-sm text-gray-500">Order food from restaurants</div>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  value="restaurant"
                  {...register('role', { required: 'Please select a role' })}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'restaurant'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center">
                    <Store className={`w-6 h-6 mr-3 ${
                      selectedRole === 'restaurant' ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`font-medium ${
                        selectedRole === 'restaurant' ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        Restaurant
                      </div>
                      <div className="text-sm text-gray-500">Sell food to customers</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="address"
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="input-field pl-10"
                  placeholder="Enter your address"
                />
              </div>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>
          </div>

          {/* Restaurant Specific Fields */}
          {selectedRole === 'restaurant' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 border-t pt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Restaurant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="restaurantName"
                      type="text"
                      {...register('restaurantName', { 
                        required: selectedRole === 'restaurant' ? 'Restaurant name is required' : false 
                      })}
                      className="input-field pl-10"
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  {errors.restaurantName && <p className="text-red-500 text-sm mt-1">{errors.restaurantName.message}</p>}
                </div>

                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine Type
                  </label>
                  <select
                    id="cuisine"
                    {...register('cuisine', { 
                      required: selectedRole === 'restaurant' ? 'Cuisine type is required' : false 
                    })}
                    className="input-field"
                  >
                    <option value="">Select cuisine type</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="indian">Indian</option>
                    <option value="mexican">Mexican</option>
                    <option value="american">American</option>
                    <option value="thai">Thai</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="restaurantAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="restaurantAddress"
                    type="text"
                    {...register('restaurantAddress', { 
                      required: selectedRole === 'restaurant' ? 'Restaurant address is required' : false 
                    })}
                    className="input-field pl-10"
                    placeholder="Enter restaurant address"
                  />
                </div>
                {errors.restaurantAddress && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    className="input-field pl-10 resize-none"
                    placeholder="Describe your restaurant..."
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Store className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Restaurant Registration Process</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your restaurant application will be reviewed by our admin team. You'll receive an email notification once approved.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;