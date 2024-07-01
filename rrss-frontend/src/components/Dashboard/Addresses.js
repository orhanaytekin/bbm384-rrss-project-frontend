import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup, Container, Card, Row, Col } from 'react-bootstrap';
import '../../styles/Addresses.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [editingAddress, setEditingAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users');
        const user = response.data.find(user => user.username === username);
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const response = await axios.get('http://localhost:8080/api/addresses');
          setAddresses(response.data.filter(address => address.user.id === userId));
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = async (event) => {
    event.preventDefault();
    if (userId) {
      try {
        const response = await axios.post('http://localhost:8080/api/addresses/create', { ...newAddress, user: { id: userId } });
        setAddresses([...addresses, response.data]);
        setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/addresses/${id}`);
      setAddresses(addresses.filter(address => address.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const handleUpdateAddress = async (event) => {
    event.preventDefault();
    if (editingAddress) {
      try {
        const response = await axios.put(`http://localhost:8080/api/addresses/${editingAddress.id}`, newAddress);
        setAddresses(addresses.map(address => (address.id === editingAddress.id ? response.data : address)));
        setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
        setEditingAddress(null);
      } catch (error) {
        console.error('Error updating address:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    setEditingAddress(null);
  };

  return (
    <Container className="addresses-container mt-4">
      <h2>Addresses</h2>
      <Form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="mb-4">
        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            required
          />
          <Form.Control
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="mt-2"
            required
          />
          <Form.Control
            type="text"
            placeholder="State"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            className="mt-2"
            required
          />
          <Form.Control
            type="text"
            placeholder="Zip Code"
            value={newAddress.zipCode}
            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            className="mt-2"
            required
          />
          <Form.Control
            type="text"
            placeholder="Country"
            value={newAddress.country}
            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
            className="mt-2"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
          {editingAddress ? 'Update Address' : 'Add Address'}
        </Button>
        {editingAddress && (
          <Button variant="secondary" onClick={handleCancelEdit} className="mt-2 ml-2">
            Cancel
          </Button>
        )}
      </Form>
      <Row>
        {addresses.map((address) => (
          <Col md={4} key={address.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Text>{`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEditAddress(address)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Addresses;
