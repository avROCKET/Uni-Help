import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();

  return (
    <div>
      <h1>UserDashboard works</h1>
      <button type="button" onClick={() => navigate('/login')}>Login here</button>
    </div>
  );
}

export default UserDashboard;