import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card } from 'react-bootstrap';
import '../../styles/Profile.css';

const Profile = () => {
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

  const roleBackgrounds = {
    USER: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    MERCHANT: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    ADMIN: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'COMMUNITY_MANAGER': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  };

  const backgroundStyle = {
    background: roleBackgrounds[user.role] || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  };

  return (
    <div style={backgroundStyle}>
      <Container className="profile-container">
        <Card className="text-center profile-card">
          <Card.Body>
            <Card.Title className="profile-title">Hello, <u>{user.role}</u> {user.username}</Card.Title>
            <Card.Text className="profile-text">E-mail: {user.email}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
