import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import ClientRegistrationForm from './components/Client/ClientRegistrationForm';
import ServiceOwnerRegistrationForm from "./components/ServiceOwner/ServiceOwnerRegistrationForm";
import ForgotPassword from './components/Admin/ForgotPassword';



function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Client Registration Route */}

      <Route path="/register/client" element={<ClientRegistrationForm />} />
      <Route path="/register/service-owner" element={<ServiceOwnerRegistrationForm />} />
    </Routes>
  );
}

export default App;