import React, { useEffect, useState } from "react";
import axios from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Ensure you have styles for a better UI

const AdminLogin = () => {
  // State for form inputs and error/message handling
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // React Router hooks for navigation and query parameters
  const navigate = useNavigate();
  const location = useLocation();

  // Step 1: Check for messages in query parameters (e.g., after redirects)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const msg = queryParams.get("message");
    if (msg) {
      setMessage(msg); // Display the message if it exists
    }
  }, [location]);

  // Step 2: Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Send login request to the server
      const response = await axios.post("/token/", { username, password });
      console.log("Login response:", response.data);

      // Store tokens in localStorage for future requests
      localStorage.setItem("adminAccessToken", response.data.access);
      localStorage.setItem("adminRefreshToken", response.data.refresh);

      // Redirect to the admin dashboard on successful login
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError("Invalid credentials or not an admin."); // Display error message
    }
  };

  // Step 3: Render the login form
  return (
    <div className="admin-login-container">
      <div className="login-box">
        <h2>Admin Login</h2>

        {/* Display error or message if any */}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="error-message">{message}</p>}

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Forgot password link */}
        <div className="login-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;