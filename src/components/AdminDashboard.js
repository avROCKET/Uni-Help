import React, { useEffect, useState } from 'react';
import { getPendingApprovals, getAllUsers, updateUserRole, deleteUser } from '../utils/dataFunctions.js';

function AdminDashboard() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending')

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
      <h1>Admin Dashboard</h1>
      <div className="tabs">
          <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active-tab' : ''}>
              Pending Approvals
          </button>
          <button onClick={() => setActiveTab('active')} className={activeTab === 'active' ? 'active-tab' : ''}>
              All Users
          </button>
          <button onClick={() => setActiveTab('reject')} className={activeTab === 'reject' ? 'active-tab' : ''}>
              Rejected Users
          </button>
      </div>
      {activeTab === 'pending' && (
        <div>
          <h2>Pending Approvals</h2>
          {pendingApprovals.map((approval, index) => (
            <div key={index}>
              <p>
                <button onClick={() => handleApprove(approval)}>Approve</button>&nbsp;
                <button onClick={() => handleReject(approval)}>Reject</button>&nbsp;&nbsp;
                {approval.name} --- {approval.email} 
              </p>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'active' && (
        <div>
          <h2>All Active Users</h2>
          {allUsers
          .filter(user => user.role !== 'admin')
          .filter(user => user.role !== 'pending')
          .filter(user =>user.role !== 'rejected')
          .map((user, index) => (
            <div key={index}>
              <p>
                <button onClick={() => handleDelete(user)}>Delete</button> &nbsp;&nbsp;
                {user.name} --- {user.email} --- {user.role}
              </p>
          </div>
        ))}
        </div>
    )}
  
  {activeTab === 'reject' && (
    <div>
      <h2>Rejected Users</h2>
      {allUsers
      .filter(user => user.role === 'rejected')
      .map((user, index) => (
        <div key={index}>
          <p>
            <button onClick={() => handleDelete(user)}>Delete</button> &nbsp;&nbsp;
            {user.name} --- {user.email} --- {user.role}
          </p>
        </div>
      ))}
    </div>
  )}

    </div>

  );
}

export default AdminDashboard;
