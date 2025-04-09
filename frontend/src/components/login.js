import React, { useState } from 'react';
import axios from "../api";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const response = await axios.post("/custom-token/", { username, password });
      console.log("Login response:", response.data);

      // Save tokens
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Store user_type (from response)
      const userType = response.data.user_type;

      // Optional: Store user_type if needed across the app
      localStorage.setItem("userType", userType);

      // Navigate based on user type
      if (userType === 'client') {
        navigate("/client/dashboard");
      } else if (userType === 'service_owner') {
        navigate("/service-owner/dashboard");
      } else if (userType === 'admin') {
        navigate("/admin/dashboard");
      } else {
        setError("Unknown user type.");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username (Email/Phone/Username):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email, phone, or username"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
