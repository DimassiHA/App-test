import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../components/Admin/AdminLogin";
import Dashboard from "../components/Admin/Dashboard";

const AdminPage = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin" />} /> {/* Redirect to login if no route matches */}
    </Routes>
  );
};

export default AdminPage;