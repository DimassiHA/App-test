import React, { useEffect, useState } from "react";
import axios from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const msg = queryParams.get("message");
    if (msg) setMessage(msg);
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/token/", { username, password });
      const decoded = jwtDecode(response.data.access);

      // Check if the user_type is either 'admin' or 'superuser'
      if (decoded.user_type === "admin" || decoded.user_type === "superuser") {
        localStorage.setItem("adminAccessToken", response.data.access);
        localStorage.setItem("adminRefreshToken", response.data.refresh);
        navigate("/admin/dashboard");
      } else {
        setError("You are not an admin or superuser. Access denied.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="info-message">{message}</p>}
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
        <div className="login-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
