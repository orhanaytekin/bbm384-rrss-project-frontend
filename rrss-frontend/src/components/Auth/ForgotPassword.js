import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    // Simulate sending the reset link
    alert('Your new password has been sent to your email');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleForgotPassword} className="auth-form">
        <h2>Forgot Password</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/login')}>Back to Login</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
