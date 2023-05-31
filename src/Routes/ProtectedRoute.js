import React from 'react';
import { Navigate } from "react-router-dom";
import { routes } from './routes';

const ProtectedRoute = ({ user, children }) => {
  const { signIn } = routes;
    if (user) {
      return children;
    }
    return <Navigate to={signIn} />;
  };

export default ProtectedRoute;