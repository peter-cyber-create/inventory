import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { notification } from 'antd';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  const isAuthenticated = token && user.id;
  const hasPermission = allowedRoles.includes(userRole) || userRole === 'admin';

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          notification.error({
            message: 'Authentication Required',
            description: 'Please log in to access this page.',
          });
          return <Redirect to="/" />;
        }

        if (!hasPermission) {
          notification.error({
            message: 'Access Denied',
            description: 'You do not have permission to access this module.',
          });
          
          // Redirect to user's default dashboard
          const dashboardRoutes = {
            'it': '/ict/dashboard',
            'garage': '/fleet/dashboard',
            'store': '/stores/dashboard',
            'finance': '/finance/dashboard',
            'admin': '/ict/dashboard'
          };
          
          return <Redirect to={dashboardRoutes[userRole] || '/ict/dashboard'} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
