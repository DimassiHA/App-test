import React, { useState } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import './login.css'; 

const Login = () => {
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/custom-token/", { username, password });
  
      // Store tokens and user info
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userType", response.data.user_type);
      localStorage.setItem("username", response.data.username);
  
      // Redirect based on user type
      switch(response.data.user_type) {
        case 'client':
          navigate("/client/dashboard");
          break;
        case 'service_owner':
          navigate("/service-owner/dashboard");
          break;
        case 'admin':
          navigate("/admin/dashboard");
          break;
        default:
          setError("Unknown user type.");
      }
  
    } catch (err) {
      console.error("Login error:", err.response?.data);
      
      // Handle different error cases
      if (err.response?.data?.non_field_errors) {
        const errorMsg = err.response.data.non_field_errors[0];
        setError(errorMsg);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
      
      // Clear tokens on any error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Username (Email/Phone/Username):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email, phone number, or username"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;