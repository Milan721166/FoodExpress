import { createContext, useState, useContext } from 'react';

// Create and export the context
export const UserContext = createContext();

// User provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser && storedUser !== 'undefined' 
        ? JSON.parse(storedUser) 
        : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  // Update both state and localStorage
  const updateUser = (userData) => {
    try {
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
      }
      setUser(userData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for accessing user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}