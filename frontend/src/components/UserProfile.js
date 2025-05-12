import React, { useEffect, useState } from 'react';
import API from '../api';
import './UserProfile.css';
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile/");

        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  const renderProfilePicture = (url) => {
    return url ? (
      <img src={url} alt="Profile" style={{ width: 150, height: 150, borderRadius: '50%' }} />
    ) : (
      <p>No profile picture</p>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {renderProfilePicture(profile.profile_picture || "")}
        <h2>{profile.user.username}</h2>
        <p>{profile.user.first_name} {profile.user.last_name}</p>
      </div>
  
      <div className="profile-info">
        <div><strong>Email:</strong> {profile.user.email}</div>
        <div><strong>Phone:</strong> {profile.user.phone_number}</div>
        <div><strong>Region:</strong> {profile.user.region}</div>
        <div><strong>Birth Date:</strong> {profile.user.birth_date}</div>
  
        {"gender" in profile && (
          <div><strong>Gender:</strong> {profile.gender}</div>
        )}
  
        {"business_name" in profile && (
          <>
            <div><strong>Business Name:</strong> {profile.business_name}</div>
            <div><strong>Description:</strong> {profile.description}</div>
          </>
        )}
      </div>
  
      {profile.service_pictures?.length > 0 && (
        <div className="service-gallery">
          <h4>Service Pictures:</h4>
          <div className="gallery">
            {profile.service_pictures.map((pic, idx) => (
              <img key={idx} src={pic.image} alt={`Service ${idx}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UserProfile;
