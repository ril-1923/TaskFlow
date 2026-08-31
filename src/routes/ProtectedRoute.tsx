import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { auth } = useApp();
  if (!auth.loggedIn) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
