// // components/PrivateRoute.jsx
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const isAuthenticated = !!localStorage.getItem("token"); // or use context if you have one

//     return isAuthenticated ? children : <Navigate to="/user-login" />;
// };

// export default PrivateRoute;



// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    return token ? children : <Navigate to="/user-login" />;
};

export default ProtectedRoute;
