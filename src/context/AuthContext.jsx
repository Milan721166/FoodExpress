// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8081/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.valid) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('adminToken', token);
    setUser(userData);
    navigate('/admin-dashboard');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/admin-login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}