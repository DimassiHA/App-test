import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    region: "",
    birth_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Starting profile fetch..."); // Debug 1
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Token found:", !!token); // Debug 2
        
        if (!token) {
          console.log("No token, redirecting..."); // Debug 3
          navigate("/admin?message=Please log in first");
          return;
        }
  
        const decoded = jwtDecode(token);
        console.log("Decoded token user ID:", decoded.user_id); // Debug 4
  
        const response = await API.get(`/admin/users/${decoded.user_id}/`);
        console.log("API response received:", response.data); // Debug 5
  
        setFormData({
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number || "",
          region: response.data.region || "",
          birth_date: response.data.birth_date || "",
        });
        setLoading(false);
        console.log("Profile data set, loading complete"); // Debug 6
      } catch (err) {
        console.error("Profile fetch error:", err); // Debug 7
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      
      // Remove the response assignment since we're not using it
      await API.patch(
        `/admin/users/${decoded.user_id}/`, 
        formData
      );
  
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/admin/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
          
          <div className="form-group">
            <label>Region:</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
          
          <div className="form-group">
            <label>Birth Date:</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate("/admin/profile")} 
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;