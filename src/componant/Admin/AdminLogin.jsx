// src/components/AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../css/AdminLogin.css';

function AdminLogin({ theme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8081/api/admin/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data?.token && response.data?.user) {
        await login(response.data.user, response.data.token);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      }
      
      setError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-login-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-login-box">
        <h1 className="admin-login-title">Admin Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group animate-slide-in">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group animate-slide-in">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="admin-login-button animate-fade-in"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>
        <p className="admin-login-footer animate-fade-in">
          Forgot your password? <a href="/reset-password">Reset here</a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;