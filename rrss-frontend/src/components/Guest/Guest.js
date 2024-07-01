import React from 'react';
import { useNavigate } from 'react-router-dom';

const Guest = () => {
  const navigate = useNavigate();

  return (
    <div className="guest-container">
      <h2>Welcome, Guest!</h2>
      <p>Browse our products and enjoy your shopping experience.</p>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>
        View Products
      </button>
    </div>
  );
};

export default Guest;
