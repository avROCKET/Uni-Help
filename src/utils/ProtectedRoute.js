import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.js'; 

function ProtectedRoute({ element }) {
  const { user } = useContext(AuthContext); 

  return user ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;