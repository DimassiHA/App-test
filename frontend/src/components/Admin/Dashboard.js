import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const Dashboard = () => {
  // State for form data, error handling, superuser status, and user list
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
  const [users, setUsers] = useState([]); // State to store the list of users

  // React Router hook for navigation
  const navigate = useNavigate();

  // Step 1: Check user permissions on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      // Check if the user is a superuser
      if (decoded.is_superuser) {
        setIsSuperuser(true); // Set superuser status
        fetchUsers(); // Fetch users when the component mounts
      }
    } else {
      // Redirect to login if no token is found
      navigate("/admin?message=No access token found. Please log in.");
    }
  }, [navigate]);

  // Step 2: Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/Admin/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      setUsers(response.data); // Store the fetched users in state
    } catch (err) {
      console.error("Error fetching users:", err.response?.data);
      setError("Failed to fetch users. Please try again.");
    }
  };

  // Step 3: Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin"); // Redirect to login page
  };

  // Step 4: Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Step 5: Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Step 6: Handle form submission (create user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Send request to create a new user
      const response = await axios.post("/Admin/create-user/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });

      // Handle successful user creation
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
        fetchUsers(); // Refresh the user list after creating a new user
      }
    } catch (err) {
      console.error("Error creating user:", err.response?.data);
      setError("Failed to create user. Please try again."); // Display error message
    }
  };

  // Step 7: Render the dashboard
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* Logout button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {/* Display error messages */}
      {error && <p className="error-message">{error}</p>}

      {/* Render user creation form and user list for superusers */}
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
            <div>
              <label>Is superuser:</label>
              <input
                type="checkbox"
                name="is_superuser"
                checked={formData.is_superuser}
                onChange={handleCheckboxChange}
              />
            </div>
            <button type="submit">Create User</button>
          </form>

          {/* Display the list of users in a table */}
          <h2>User List</h2>
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
                  <td>
                    {user.is_superuser
                      ? "Superuser"
                      : user.is_app_admin
                      ? "App Admin"
                      : "Client"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        // Display message for non-superusers
        <p className="info-message">
          You do not have permission to create users or view the user list. Only superusers can access
          these features.
        </p>
      )}
    </div>
  );
};

export default Dashboard;