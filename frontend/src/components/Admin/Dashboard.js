import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      if (decoded.user_type === "superuser") {
        setIsSuperuser(true);
        fetchUsers();
      }
    } else {
      navigate("/admin?message=No access token found. Please log in.");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/Admin/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data);
      setError(err.response?.data?.message || "Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin");
  };

  const navigateToCreateUser = () => {
    navigate("/admin/add-user");
  };

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