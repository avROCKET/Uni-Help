import React, { useEffect, useState } from 'react';
import { getPendingApprovals, getAllUsers, updateUserRole, deleteUser } from '../utils/dataFunctions.js';

function AdminDashboard() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchPendingApprovals = async () => {
    try {
      const approvals = await getPendingApprovals();
      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprove = async (user) => {
    try {
      console.log('Approving user:', user);
      await updateUserRole(user.id, 'company');
      await fetchPendingApprovals();
      await fetchAllUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };
  
  const handleReject = async (user) => {
    try {
      console.log('Rejecting user:', user);
      await updateUserRole(user.id, 'rejected');
      await fetchPendingApprovals();
      await fetchAllUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (user) => {
    try {
      console.log('Deleting user:', user);
      await deleteUser(user.id);
      await fetchPendingApprovals();
      await fetchAllUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
    fetchAllUsers();
  }, []);

  return (
    <div className='dashboard-container'>
      <h1>Admin Dashboard works</h1>

      <h2>Pending Approvals</h2>
      {pendingApprovals.map((approval, index) => (
        <div key={index}>
          <p>{approval.name} - {approval.email} <button onClick={() => handleApprove(approval)}>Approve</button></p>
          <button onClick={() => handleApprove(approval)}>Approve</button>
          <button onClick={() => handleReject(approval)}>Reject</button>
        </div>
      ))}

      <h2>All Users</h2>
      {allUsers
      .filter(user => user.role !== 'admin')
      .filter(user => user.role !== 'pending')
      .map((user, index) => (
        <div key={index}>
          <p>{user.name} - {user.email} - {user.role}</p>
          <button onClick={() => handleDelete(user)}>Delete</button>
    </div>
))}
    </div>
  );
}

export default AdminDashboard;
