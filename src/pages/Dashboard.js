import React, { useContext, useEffect, useState } from 'react';
import { logout } from '../utils/authFunctions.js';
import { AuthContext } from '../utils/AuthContext.js';
import { getUserData, getPendingApprovalData } from '../utils/dataFunctions.js';
import AdminDashboard from '../components/AdminDashboard'; 
import UserDashboard from '../components/UserDashboard'; 
import CompanyDashboard from '../components/CompanyDashboard'; 
import PendingDashboard from '../components/PendingDashboard'; 
import RejectedDashboard from '../components/RejectedDashboard'; 
import SupportADashboard from '../components/SupportADashboard.js';
import SupportBDashboard from '../components/SupportBDashboard.js';
import SupportCDashboard from '../components/SupportCDashboard.js';
import ReviewerDashboard from '../components/ReviewerDashboard.js';

function Dashboard() {
  const { user } = useContext(AuthContext); 
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        let data = await getUserData(user.uid);

        if (!data) {
          data = await getPendingApprovalData(user.email); 
        }

        setUserData(data);
      };
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const renderDashboard = () => {
    if (!userData) return <div>Loading...</div>;

    switch (userData.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <UserDashboard />;
      case 'company':
        return <CompanyDashboard />;
      case 'pending':
        return <PendingDashboard />;
      case 'rejected':
        return <RejectedDashboard />;
      case 'supporta':
        return <SupportADashboard />;
      case 'supportb':
        return <SupportBDashboard />;
      case 'supportc':
        return <SupportCDashboard />;
      case 'reviewer':
        return <ReviewerDashboard />;
      default:
        return <p>Invalid role</p>;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userData ? userData.name : "User"}</p>
      {userData && <p>Account role: {userData.role}</p>}
      {renderDashboard()}
      <button onClick={handleLogout}>Remember to Logout!</button>
    </div>
  );
}

export default Dashboard;
