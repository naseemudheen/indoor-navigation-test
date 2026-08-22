import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isAuthorized } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !isAuthorized(allowedRoles)) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
