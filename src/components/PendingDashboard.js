import React, { useEffect, useState } from 'react';
import { getPendingApprovalData } from '../utils/dataFunctions.js';

function PendingDashboard() {
  const [pendingData, setPendingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const data = await getPendingApprovalData();
        setPendingData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPendingData();
  }, []);

  if (error) {
    return <p>Error loading data: {error}</p>;
  }

  if (!pendingData) {
    return <p>not loading.</p>;
  }

  return (
    <div>
      <h2>Pending Dashboard works</h2>
      <p>Your account is pending approval.</p>
      <p>Name: {pendingData.name}</p>
      <p>Email: {pendingData.email}</p>
      <p>Account Status: {pendingData.role}</p>
    </div>
  );
}

export default PendingDashboard;
