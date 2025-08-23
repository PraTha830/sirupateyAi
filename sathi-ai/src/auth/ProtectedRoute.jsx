import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { authed } = useAuth();
  const location = useLocation();
  return authed ? <Outlet /> : <Navigate to="/landing" replace state={{ from: location }} />;
}
