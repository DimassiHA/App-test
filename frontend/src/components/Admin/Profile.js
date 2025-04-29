import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone_number: "",
    region: "",
    birth_date: "",
    is_superuser: false,
    is_app_admin: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/admin?message=Please log in first");
          return;
        }

        const decoded = jwtDecode(token);
        const response = await API.get(`/admin/users/${decoded.user_id}/`);

        setUserData({
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number || "",
          region: response.data.region || "",
          birth_date: response.data.birth_date || "",
          is_superuser: response.data.is_superuser,
          is_app_admin: response.data.is_app_admin,
        });
      } catch (err) {
        setError("Failed to fetch profile data");
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Admin Profile</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-label">Username:</span>
            <span className="profile-value">{userData.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Phone Number:</span>
            <span className="profile-value">{userData.phone_number || "N/A"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Region:</span>
            <span className="profile-value">{userData.region || "N/A"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Birth Date:</span>
            <span className="profile-value">
              {userData.birth_date || "N/A"}
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Role:</span>
            <span className="profile-value">
              {userData.is_superuser
                ? "Superuser"
                : userData.is_app_admin
                ? "Admin"
                : "User"}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            onClick={handleBackToDashboard} 
            className="profile-button"
        >
        Back to Dashboard
        </button>
  <button 
    onClick={() => navigate("/admin/profile/edit")} 
    className="profile-button edit-button"
  >
    Edit Profile
  </button>
</div>
      </div>
    </div>
  );
};

export default Profile;