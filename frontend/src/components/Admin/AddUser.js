import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";


const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    region: "",
    birth_date: "",
    user_type: "client"
  });

  const [error, setError] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      if (decoded.user_type === "superuser") {
        setIsSuperuser(true);
      }
    } else {
      navigate("/admin?message=No access token found. Please log in.");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 100);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 13);

      if (birthDate < minDate || birthDate > maxDate) {
        setError("Birth date must be between 13 and 100 years ago");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
      const { confirmPassword, ...userData } = formData;
      const response = await API.post("/Admin/create-user/", userData);
  
      if (response.status === 201) {
        alert("User created successfully!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Error creating user:", err.response?.data);
      setError(err.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Create New User</h1>
        <div className="dashboard-actions">
          <button onClick={handleBack} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isSuperuser ? (
        <form onSubmit={handleSubmit} className="create-user-form">
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
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label>User Type:</label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
              required
            >
              <option value="client">Client</option>
              <option value="service_owner">Service Owner</option>
              <option value="admin">Admin</option>
              <option value="superuser">Superuser</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create User"}
          </button>
        </form>
      ) : (
        <p className="info-message">
          You do not have permission to create users. Only superusers can access this feature.
        </p>
      )}
    </div>
  );
};

export default AddUser;