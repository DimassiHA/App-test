import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUserPlus , FaCalendarAlt } from "react-icons/fa";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await API.get("/Admin/users/");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data);
        setError(err.response?.data?.message || "Failed to fetch users. Please try again.");
        if (err.response?.status === 401) {
          navigate("/admin");
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.user_type === "superuser") {
        setIsSuperuser(true);
        fetchUsers();
      }
    } else {
      navigate("/admin?message=No access token found. Please log in.");
    }
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/admin");
  };

  const navigateToCreateUser = () => {
    navigate("/admin/add-user");
  };







  const navigateToSOApproval = () => {
    navigate("/admin/SOApproval")
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/admin/profile" className="profile-link" title="View Profile">
            <FaUserCircle size={24} />
            <span className="profile-link-text">Profile</span>
          </Link>
          {isSuperuser && (
            <button onClick={navigateToCreateUser} className="create-user-button">
              <FaUserPlus size={18} />
              <span>Create User</span>
            </button>
          )}


              <button 
                onClick={() => navigate('/admin/event-types')} 
                className="action-button"
              >
                <FaCalendarAlt size={18} />
                <span>Manage Event Types</span>
              </button>

            <button onClick={navigateToSOApproval} className="create-user-button">
              <FaUserPlus size={18} />
              <span>ServiceOwnerApproval</span>
            </button>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isSuperuser ? (
        <>
          <h2>User List</h2>
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1).replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p className="info-message">
          You do not have permission to view the user list. Only superusers can access these features.
        </p>
      )}
    </div>
  );
};

export default Dashboard;