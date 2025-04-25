import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import ClientRegistrationForm from './components/Client/ClientRegistrationForm';
import ServiceOwnerRegistrationForm from "./components/ServiceOwner/ServiceOwnerRegistrationForm";


import ForgotPassword from './components/Admin/ForgotPassword';
import Login from "./components/login";
import ClientDashboard from "./components/Client/ClientDashboard";
import ServiceOwnerDashboard from "./components/ServiceOwner/ServiceOwnerDashboard";

import UserProfile from "./components/UserProfile";

import Profile from "./components/Admin/Profile";
import EditProfile from "./components/Admin/EditProfile";
import ServiceOwnerApproval from "./components/Admin/SOApproval";
import AddUser from "./components/Admin/AddUser";
import EventTypesManagement from "./components/Admin/EventTypesManagement";


function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin" />} />
      <Route path="/admin/SOApproval" element={<ServiceOwnerApproval />} />
      <Route path="/admin/add-user" element={<AddUser />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/event-types" element={<EventTypesManagement />} />
      



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
      <Route path="/profile" element={<UserProfile />} />

    </Routes>
  );
}

export default App;