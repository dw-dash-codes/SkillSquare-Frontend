import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "Customer", "Provider", or "Admin"

  // 1️⃣ Case: User Login hi nahi hai
  // Usko Login page par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Case: Login hai, lekin Ghalat Area mein hai
  // (Jaise Customer koshish kar rha hai Admin panel kholne ki)
  // Hum usko "Not Found" par bhejenge taake usay lage ye page exist hi nahi karta
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }

  // 3️⃣ Case: Sab theek hai, aanay do
  return <Outlet />;
};

export default ProtectedRoute;
