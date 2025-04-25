import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
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
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...userData } = formData;
      
      const response = await axios.post("/Admin/create-user/", userData, {
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
          confirmPassword: "",
          phone_number: "",
          region: "",
          birth_date: "",
          user_type: "client"
        });
        fetchUsers();
      }
    } catch (err) {
      console.error("Error creating user:", err.response?.data);
      setError(err.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isSuperuser ? (
        <>
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
          You do not have permission to create users or view the user list. Only superusers can access
          these features.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
