

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceOwnerDashboard= () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button
  onClick={() => navigate('/profile')}
  style={{
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#2813E1',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Marcellus, serif'
  }}
>
  View Profile
</button>
    </div>
  );
};

export default ServiceOwnerDashboard;
