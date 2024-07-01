import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GuestPromptModal = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    handleClose();
    navigate('/register');
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('guest', true);
    handleClose();
    navigate('/homepage');
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Continue as Guest</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Would you like to register or continue without registering?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
        <Button variant="primary" onClick={handleContinueAsGuest}>
          Continue as Guest
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GuestPromptModal;
