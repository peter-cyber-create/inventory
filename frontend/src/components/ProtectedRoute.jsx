import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ component: Component, allowedRoles = [], ...rest }) => {
  let user = {};
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }
  
  const userRole = user.role || localStorage.getItem('userRole') || '';
  const token = localStorage.getItem('token');

  const isAuthenticated = token && user.id;
  const hasPermission = (allowedRoles && allowedRoles.length > 0 && allowedRoles.includes(userRole)) || userRole === 'admin';

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          toast.error('Authentication Required. Please log in to access this page.');
          return <Redirect to="/" />;
        }

        if (!hasPermission) {
          toast.error('Access Denied. You do not have permission to access this module.');
          
          // Redirect to user's default dashboard
          const dashboardRoutes = {
            'it': '/ict/dashboard',
            'garage': '/fleet/dashboard',
            'store': '/stores/dashboard',
            'finance': '/finance/dashboard',
            'admin': '/dashboard'
          };
          
          return <Redirect to={dashboardRoutes[userRole] || '/ict/dashboard'} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
