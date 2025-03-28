import React, { useState } from 'react';
import axios from "../api";
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  

    // Step 2: Handle login form submission
    const handleLogin = async (e) => {
      e.preventDefault();
      setError(""); // Clear any previous errors
  
      try {
        // Send login request to the server
        const response = await axios.post("/token/", { username, password });
        console.log("Login response:", response.data);
  
        // Store tokens in localStorage for future requests
        localStorage.setItem("clientAccessToken", response.data.access);
        localStorage.setItem("clientRefreshToken", response.data.refresh);
  
        // Redirect to the admin dashboard on successful login
        navigate("/client/dashboard");
      } catch (err) {
        console.error("Login error:", err.response?.data);
        setError("Invalid credentials or not an admin."); // Display error message
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
            placeholder="Enter your email, phone number, or username"
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
