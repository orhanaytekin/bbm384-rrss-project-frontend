import React from 'react';
import Card from './Card';
import { FaHistory,FaUser, FaMapMarkerAlt, FaHeart, FaKey, FaCreditCard, FaStar, FaHome, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    
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
      <h2>User Profile</h2>
      <div className="dashboard-grid">
        <Card icon={<FaHome />} title="Home" navigateTo="/homepage" />
        <Card icon={<FaHistory />} title="Order History" navigateTo="/dashboard/order-history" />
        <Card icon={<FaMapMarkerAlt />} title="Addresses" navigateTo="/dashboard/addresses" />
              <Card icon={<FaUser />} title="Profile" navigateTo="/dashboard/profile" />
        <Card icon={<FaKey />} title="Reset Password" navigateTo="/dashboard/reset-password" />
        <Card icon={<FaCreditCard />} title="Credit Cards" navigateTo="/dashboard/credit-cards" />
        <Card icon={<FaStar />} title="Reviews" navigateTo="/dashboard/reviews" />
        <Card icon={<FaSignOutAlt />} title="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default UserDashboard;
