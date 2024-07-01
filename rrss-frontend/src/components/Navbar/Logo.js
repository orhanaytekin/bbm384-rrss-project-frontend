import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap'
import logo from './logo/logo.jpg';
import axios from 'axios';

const Logo = () => {

    const navigate = useNavigate();
    
    const username = localStorage.getItem('username');
    // function for where to navigate to based on user role
    const handleClick = () => {
        if (!localStorage.getItem('username')) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/api/auth/users/username/${username}`)
            .then(response => {
                const user = response.data;
                if (user.role === 'USER') navigate('/dashboard/user');
                if (user.role === 'COMMUNITY_MANAGER') navigate('/dashboard/community-manager');
                if (user.role === 'MERCHANT') navigate('/dashboard/merchant');
                if (user.role === 'ADMIN') navigate('/dashboard/admin');
            })
            .catch(error => console.error('Error fetching user data:', error));
    };

  return (
        <img className="logo" src={logo} alt="ShopSmart" onClick={handleClick}/>
  );
};

export default Logo;
