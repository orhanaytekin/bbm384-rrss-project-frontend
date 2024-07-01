import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import '../../styles/ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await axios.put('http://localhost:8080/api/auth/update-password', { email, newPassword });
      setMessage('Password updated successfully.');
      setVariant('success');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password.');
      setVariant('danger');
    }
  };

  return (
    <Container className="reset-password-container" >
      <h2 className="reset-password-title">Reset Password</h2>
      <Form onSubmit={handleResetPassword} className="reset-password-form">
        <Form.Group controlId="formEmail">
          <Form.Label>     </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNewPassword">
          <Form.Label>      </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="button-group">
          <Button variant="primary" type="submit">
            Update Password
          </Button>
        </div>
      </Form>
      {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
    </Container>
  );
};

export default ResetPassword;
