
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button
        onClick={() => navigate('/profile')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2813E1',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontFamily: 'Marcellus, serif'
        }}
      >
        View Profile
      </button>
    </div>
  );
};

export default ClientDashboard;
