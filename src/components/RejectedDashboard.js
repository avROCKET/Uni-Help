import React from 'react';
import { useNavigate } from 'react-router-dom';

function RejectedDashboard() {
    const navigate = useNavigate();

  return (
    <div className='dashboard-container'>
      <h1>Your request has been denied. Please contact support.</h1>
      <button className="material-button" type="button" onClick={() => navigate('/')}>Back to Homepage</button>
    </div>
  );
}

export default RejectedDashboard;