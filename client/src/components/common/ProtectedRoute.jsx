import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const ProtectedRoute = ({ children, allowRoles }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && allowRoles.length > 0 && !allowRoles.includes(currentUser.role)) {
    const fallbackPath =
      currentUser.role === 'admin'
        ? '/admin'
        : currentUser.role === 'reviewer'
          ? '/reviewer'
          : '/innovator';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
