import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Team from './pages/Team';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import VerifyOtp from './pages/VerifyOtp';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<Team />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/restaurant-dashboard" 
              element={
                <ProtectedRoute roles={['restaurant']}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </AuthProvider>
  );
};

export default App;