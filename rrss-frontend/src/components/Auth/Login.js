import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        identifier,
        password,
      });
      const userData = response.data;
      localStorage.setItem('username', userData.username); // Store username

      const user = users.find(user => user.username === userData.username);

      if (user) {
        switch (user.role) {
          case 'USER':
            navigate('/dashboard/user');
            break;
          case 'COMMUNITY_MANAGER':
            navigate('/dashboard/community-manager');
            break;
          case 'MERCHANT':
            navigate('/dashboard/merchant');
            break;
          case 'ADMIN':
            navigate('/dashboard/admin')
            break;
          default:
            navigate('/login');
        }
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem('guest', true);
    navigate('/homepage');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            className="form-control"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Login</button>
        <div className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/register')}>Register</button>
        <button type="button" className="btn btn-secondary btn-block" onClick={handleGuestAccess}>Continue as Guest</button>
      </form>
    </div>
  );
};

export default Login;
