import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { FaUser, FaBox, FaMapMarkerAlt, FaHeart, FaKey, FaCreditCard, FaStar, FaHome, FaUsers, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/UserDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Retrieve the values to be preserved
    const orderHistory = localStorage.getItem('orderHistory');
    const soldItems = localStorage.getItem('soldItems');
    const recommendationAlgorithm = localStorage.getItem('recommendationAlgorithm');

    // Clear the local storage
    localStorage.clear();

    // Restore the preserved values
    if (orderHistory !== null) {
    localStorage.setItem('orderHistory', orderHistory);
    }

    if (soldItems !== null) {
    localStorage.setItem('soldItems', soldItems);
    }
    
    if (recommendationAlgorithm !== null) {
      localStorage.setItem('recommendationAlgorithm', recommendationAlgorithm);
    }
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <h2>Admin Profile</h2>
      <div className="dashboard-grid">
        <Card icon={<FaUsers />} title="Users" navigateTo="/dashboard/users" />
        <Card icon={<FaStar />} title="Reviews" navigateTo="/reviews" />
        <Card icon={<FaFileAlt />} title="Generate Sale Report" navigateTo="/dashboard/sales-report" />
        <Card icon={<FaBox />} title="Products" navigateTo="/dashboard/products" />
        <Card icon={<FaUser />} title="Profile" navigateTo="/dashboard/profile" />
        <Card icon={<FaKey />} title="Reset Password" navigateTo="/dashboard/reset-password" />
        <Card icon={<FaHeart />} title="Recommendations" navigateTo="/dashboard/recommendations" />
        <Card icon={<FaSignOutAlt />} title="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default AdminDashboard;
