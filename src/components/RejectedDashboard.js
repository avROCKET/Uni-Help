import React from 'react';
import { useNavigate } from 'react-router-dom';

function RejectedDashboard() {
    const navigate = useNavigate();

  return (
    <div>
      <h1>Your request has been denied. Please contact support.</h1>
      <h1>also, RejectedDashboard works lol</h1>
    </div>
  );
}

export default RejectedDashboard;