import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    region: "",
    birth_date: "",
    is_app_admin: false,
  });
  const [error, setError] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIsSuperuser(decoded.is_superuser);
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData, // Fixed typo here
      [name]: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/admin/create-user/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });

      if (response.status === 201) {
        alert("User created successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          phone_number: "",
          region: "",
          birth_date: "",
          is_app_admin: false,
        });
      }
    } catch (err) {
      console.error("Error creating user:", err.response?.data);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {error && <p className="error-message">{error}</p>}

      {isSuperuser && (
        <form onSubmit={handleSubmit} className="create-user-form">
          <h2>Create User</h2>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}

              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Region:</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Birth Date:</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Is App Admin:</label>
            <input
              type="checkbox"
              name="is_app_admin"
              checked={formData.is_app_admin}
              onChange={handleCheckboxChange}
            />
          </div>
          <button type="submit">Create User</button>
        </form>
      )}


      {!isSuperuser && (
        <p className="info-message">
          You do not have permission to create users. Only superusers can create new users.
        </p>
      )}
    </div>
  );
};

export default Dashboard;