// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// geçiş için önce localStorage bazlı basit kontrol; slice'a geçirince update et
export default function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
