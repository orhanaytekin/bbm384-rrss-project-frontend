import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import UserDashboard from './components/Dashboard/UserDashboard';
import CommunityManagerDashboard from './components/Dashboard/CommunityManagerDashboard';
import HomePage from './components/Homepage/Homepage';
import Profile from './components/Dashboard/Profile';
import OrderHistory from './components/Dashboard/OrderHistory';
import Addresses from './components/Dashboard/Addresses';
import Payments from './components/Dashboard/Payments';
import ResetPassword from './components/Dashboard/ResetPassword';
import Reviews from './components/Dashboard/Reviews';
import ProductPage from './components/Product/ProductPage';
import Navbar from './components/Navbar/Navbar';
import './styles/GlobalStyles.css';
import ReviewList from './components/Dashboard/ReviewList';
import Stock from './components/Dashboard/Stock';
import ProductReviews from './components/Dashboard/ProductReviews';
import SoldItems from './components/Dashboard/SoldItems';
import MerchantDashboard from './components/Dashboard/MerchantDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SalesReport from './components/Dashboard/SalesReport';
import Users from './components/Dashboard/Users';
import ProductsAdmin from './components/Dashboard/ProductsAdmin';
import Cart from './components/Cart/Cart';
import Logo from './components/Navbar/Logo';
import Recommendations from './components/Dashboard/Recommendations';

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('username');
  };

  const location = useLocation();

  const shouldShowNavbar = () => {
    //const homepage = ['/homepage']
    const homepage = [''];
    const guestRoutes = ['/products/:id', '/homepage'];
    const userRoutes = [
      '/dashboard/profile',
      '/dashboard/order-history',
      '/dashboard/addresses',
      '/dashboard/favorites',
      '/dashboard/reset-password',
      '/dashboard/credit-cards',
      '/dashboard/reviews',
    ];
    const communityManagerRoutes = [
      '/dashboard/profile',
      '/dashboard/order-history',
      '/dashboard/addresses',
      '/dashboard/favorites',
      '/dashboard/reset-password',
      '/dashboard/credit-cards',
      '/dashboard/reviews',
    ];
    const currentPath = location.pathname;
    // return guestRoutes.includes(currentPath) || userRoutes.includes(currentPath) || communityManagerRoutes.includes(currentPath);
    return homepage.includes(currentPath);
  };

  // should show logo, show the logo on user community and admin and merchant dashboard 
  // and login and forgot poassword and register
  // but not on guest pages
  const shouldShowLogo = () => {
    const except = ['/products/:id', 'products', '/homepage', '/cart'];
    const currentPath = location.pathname;
    return !except.includes(currentPath);
  };

  return (
    <div className="App">
      {shouldShowNavbar() && <Navbar onSearch={(query) => console.log(query)} />}
      {/* {shouldShowLogo() && <Logo />} */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard/user" element={isAuthenticated() ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/community-manager" element={isAuthenticated() ? <CommunityManagerDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/merchant" element={isAuthenticated() ? <MerchantDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/admin" element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/dashboard/order-history" element={isAuthenticated() ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/dashboard/addresses" element={isAuthenticated() ? <Addresses /> : <Navigate to="/login" />} />
        <Route path="/dashboard/favorites" element={isAuthenticated() ? <Reviews /> : <Navigate to="/login" />} />
        <Route path="/dashboard/reset-password" element={isAuthenticated() ? <ResetPassword /> : <Navigate to="/login" />} />
        <Route path="/dashboard/credit-cards" element={isAuthenticated() ? <Payments /> : <Navigate to="/login" />} />
        <Route path="/dashboard/reviews" element={isAuthenticated() ? <Reviews /> : <Navigate to="/login" />} />
        <Route path="/reviews" element={isAuthenticated() ? <ReviewList /> : <Navigate to="/login" />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/guest" element={<Navigate to="/homepage" />} />
        <Route path="/dashboard/stock" element={isAuthenticated() ? <Stock /> : <Navigate to="/login" />} />
        <Route path="/dashboard/product-reviews" element={isAuthenticated() ? <ProductReviews /> : <Navigate to="/login" />} />
        <Route path="/dashboard/sold-items" element={isAuthenticated() ? <SoldItems /> : <Navigate to="/login" />} />
        <Route path="/dashboard/update-password" element={isAuthenticated() ? <ResetPassword /> : <Navigate to="/login" />} />
        <Route path="/dashboard/sales-report" element={isAuthenticated() ? <SalesReport /> : <Navigate to="/login" />} />
        <Route path="/dashboard/users" element={isAuthenticated() ? <Users /> : <Navigate to="/login" />} />
        <Route path="/dashboard/products" element={isAuthenticated() ? <ProductsAdmin /> : <Navigate to="/login" />} />
        <Route path="/dashboard/recommendations" element={isAuthenticated() ? <Recommendations /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
