import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [error, setError] = useState("");
  const [isAppAdmin, setIsAppAdmin] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (token) {
      const decoded = jwtDecode(token);
      setIsAppAdmin(decoded.is_app_admin);
      setIsSuperuser(decoded.is_superuser);
      
      if (decoded.is_app_admin) {
        fetchPendingOwners();
      }
    } else {
      navigate("/admin?message=No access token found. Please log in.");
    }
  }, [navigate]);

  const fetchPendingOwners = async () => {
    try {
      const response = await axios.get("/admin/service-owners/pending/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      setPendingOwners(response.data);
      setNotificationCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending owners:", err);
      setError("Failed to fetch pending service owners");
    }
  };

  const handleApprove = async (ownerId) => {
    try {
      await axios.post(`/admin/service-owners/${ownerId}/approve/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      fetchPendingOwners(); // Refresh the list
    } catch (err) {
      console.error("Error approving owner:", err);
      setError("Failed to approve service owner");
    }
  };

  const handleReject = async (ownerId) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (reason) {
      try {
        await axios.post(`/admin/service-owners/${ownerId}/reject/`, { reason }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        });
        fetchPendingOwners(); // Refresh the list
      } catch (err) {
        console.error("Error rejecting owner:", err);
        setError("Failed to reject service owner");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          {isAppAdmin && notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
          <Link to="/admin/profile" className="profile-link">
            <FaUserCircle size={24} />
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isAppAdmin && (
        <div className="approval-section">
          <h2>Pending Service Owner Approvals</h2>
          {pendingOwners.length === 0 ? (
            <p>No pending service owner registrations</p>
          ) : (
            <div className="pending-owners-list">
              {pendingOwners.map((owner) => (
                <div key={owner.id} className="owner-card">
                  <div className="owner-info">
                    <h3>{owner.business_name}</h3>
                    <p>{owner.description}</p>
                    <p>Registered by: {owner.user.username}</p>
                    <p>Email: {owner.user.email}</p>
                    {owner.profile_picture && (
                      <img 
                        src={owner.profile_picture} 
                        alt={`${owner.business_name} profile`}
                        className="owner-image"
                      />
                    )}
                  </div>
                  <div className="owner-actions">
                    <button 
                      onClick={() => handleApprove(owner.id)}
                      className="approve-button"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(owner.id)}
                      className="reject-button"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keep existing superuser functionality */}
      {isSuperuser && (
        <>
          {/* ... existing superuser form and user list ... */}
        </>
      )}

      {!isAppAdmin && !isSuperuser && (
        <p className="info-message">
          You don't have admin privileges. Contact a superuser for access.
        </p>
      )}
    </div>
  );
};

export default Dashboard;