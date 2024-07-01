import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/dashboard/profile">Profile</Link></li>
          <li><Link to="/dashboard/products">Products</Link></li>
          <li><Link to="/dashboard/reviews">Reviews</Link></li>
          <li><Link to="/dashboard/users">Users</Link></li>
        </ul>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
