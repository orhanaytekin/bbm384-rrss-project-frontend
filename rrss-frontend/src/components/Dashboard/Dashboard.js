import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import UserDashboard from './UserDashboard';
import MerchantDashboard from './MerchantDashboard';
import AdminDashboard from './AdminDashboard';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('No username found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/auth/users/username/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <h2>Welcome, {user.username}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

        {/* Common components */}
        <div>
          <h3>Common Section</h3>
          {/* Add common components here */}
        </div>

        {/* Role-specific components */}
        {user.role === 'USER' && <UserDashboard />}
        {user.role === 'MERCHANT' && <MerchantDashboard />}
        {user.role === 'ADMIN' && <AdminDashboard />}
      </div>
    </Layout>
  );
};

export default Dashboard;
