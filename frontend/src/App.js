import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import ClientRegistrationForm from './components/Client/ClientRegistrationForm';
import ServiceOwnerRegistrationForm from "./components/ServiceOwner/ServiceOwnerRegistrationForm";


import ForgotPassword from './components/Admin/ForgotPassword';
import Login from "./components/login";
import ClientDashboard from "./components/Client/ClientDashboard";
import ServiceOwnerDashboard from "./components/ServiceOwner/ServiceOwnerDashboard";
import Profile from "./components/Admin/Profile";
import EditProfile from "./components/Admin/EditProfile";



function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin" />} />
<<<<<<< HEAD
      <Route path="/admin/profile" element={<Profile />} />
=======

>>>>>>> 1df40f18672e0899f9db2f31f5fc38c3d0e02689
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard/>} />
      <Route path="/service-owner/dashboard" element={<ServiceOwnerDashboard/>} />
      <Route path="/admin/profile/edit" element={<EditProfile />} />


      {/* Client Registration Route */}
      <Route path="/register/client" element={<ClientRegistrationForm />} />
      <Route path="/register/service-owner" element={<ServiceOwnerRegistrationForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard/>} />
      <Route path="/service-owner/dashboard" element={<ServiceOwnerDashboard/>} />

    </Routes>
  );
}

export default App;