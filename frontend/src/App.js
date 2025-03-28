import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import ClientRegistrationForm from './components/Client/ClientRegistrationForm';
import ServiceOwnerRegistrationForm from "./components/ServiceOwner/ServiceOwnerRegistrationForm";
<<<<<<< HEAD
import Login from "./components/login";
import ClientDashboard from "./components/Client/ClientDashboard";
import ServiceOwnerDashboard from "./components/ServiceOwner/ServiceOwnerDashboard";


=======



>>>>>>> f772450f4d906ded89a1619b55a7d51b9705c7f1
function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin" />} />
<<<<<<< HEAD

      <Route path="/register/client" element={<ClientRegistrationForm />} />
      <Route path="/register/service-owner" element={<ServiceOwnerRegistrationForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard" element={<ClientDashboard/>} />
      <Route path="/service-owner/dashboard" element={<ServiceOwnerDashboard/>} />

=======
      
      {/* Client Registration Route */}

      <Route path="/register/client" element={<ClientRegistrationForm />} />
      <Route path="/register/service-owner" element={<ServiceOwnerRegistrationForm />} />
>>>>>>> f772450f4d906ded89a1619b55a7d51b9705c7f1
    </Routes>
  );
}

export default App;