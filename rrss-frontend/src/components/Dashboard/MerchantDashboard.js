import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { FaHistory, FaBox, FaMapMarkerAlt, FaHeart, FaKey, FaCreditCard, FaStar, FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import '../../styles/UserDashboard.css';

const MerchantDashboard = () => {
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
      <h2>Merchant Profile</h2>
      <div className="dashboard-grid">
        <Card icon={<FaBox />} title="Stock" navigateTo="/dashboard/stock" />
        <Card icon={<FaStar />} title="Product Reviews" navigateTo="/dashboard/product-reviews" />
        <Card icon={<FaHistory />} title="Sold Items" navigateTo="/dashboard/sold-items" />
        <Card icon={<FaKey />} title="Reset Password" navigateTo="/dashboard/reset-password" />
        <Card icon={<FaUser />} title="Profile" navigateTo="/dashboard/profile" />
        <Card icon={<FaSignOutAlt />} title="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default MerchantDashboard;
