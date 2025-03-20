import React, { useState } from "react";
import axios from "../../api";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Ensure you have styles for a better UI
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");


    try {
        const response = await axios.post("/token/", { username, password });
        console.log("Login response:", response.data); 
        localStorage.setItem("adminAccessToken", response.data.access);
        localStorage.setItem("adminRefreshToken", response.data.refresh);
        navigate("/admin/dashboard");
      } catch (err) {
        console.error("Login error:", err.response?.data); // Log the error
        setError("Invalid credentials or not an admin.");
      }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
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
    </div>
  );
};

export default AdminLogin;
