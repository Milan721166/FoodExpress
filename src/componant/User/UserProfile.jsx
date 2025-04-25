import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faHistory, faHeart } from '@fortawesome/free-solid-svg-icons';
import '../css/UserProfile.css'; // Ensure you have this CSS file for styling

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First check if we have user data in location state
        if (location.state?.user) {
          setUser(location.state.user);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/user-login');
          return;
        }

        const response = await fetch('http://localhost:8081/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
        navigate('/user-login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [location.state, navigate]);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">Error: {error}</div>;
  if (!user) return <div className="profile-not-found">User not found</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.avatar || 'https://via.placeholder.com/150'} 
            alt={`${user.username}'s avatar`} 
          />
        </div>
        <div className="profile-info">
          <h2>{user.username || user.email.split('@')[0]}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">Role: {user.role}</p>
          {user.phone && <p className="profile-phone">Phone: {user.phone}</p>}
          <button className="edit-profile-btn">
            <FontAwesomeIcon icon={faUserEdit} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3><FontAwesomeIcon icon={faHistory} /> Order History</h3>
          {user.orders?.length > 0 ? (
            <ul className="order-history">
              {user.orders.slice(0, 5).map(order => (
                <li key={order.id}>
                  <p>Order #{order.id} - {new Date(order.date).toLocaleDateString()}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No order history found</p>
          )}
        </div>

        <div className="profile-section">
          <h3><FontAwesomeIcon icon={faHeart} /> Favorites</h3>
          {user.favorites?.length > 0 ? (
            <div className="favorites-grid">
              {user.favorites.map(dish => (
                <div key={dish.id} className="favorite-item">
                  <img src={dish.imageUrl} alt={dish.name} />
                  <p>{dish.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No favorites added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;