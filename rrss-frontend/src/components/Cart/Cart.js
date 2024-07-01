import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, ListGroup, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [newPayment, setNewPayment] = useState({ cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCart(cartItems);
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users');
        setUsers(response.data);
        const username = localStorage.getItem('username');
        if (username) {
          const currentUser = response.data.find(user => user.username === username);
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const response = await axios.get('http://localhost:8080/api/addresses');
          const userAddresses = response.data.filter(address => address.user.id === user.id);
          setAddresses(userAddresses);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };

    fetchAddresses();
  }, [user]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (user) {
        try {
          const response = await axios.get('http://localhost:8080/api/payment-methods');
          const userPayments = response.data.filter(payment => payment.user.id === user.id);
          setPayments(userPayments);
        } catch (error) {
          console.error('Error fetching payment methods:', error);
        }
      }
    };

    fetchPayments();
  }, [user]);

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + amount) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      alert('Please fill out all address fields.');
      return;
    }
    if (user) {
      axios.post(`http://localhost:8080/api/addresses/create`, {
        ...newAddress,
        user: { id: user.id }
      })
      .then(response => setAddresses([...addresses, response.data]))
      .catch(error => console.error('Error adding address:', error));
    } else {
      setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    }
    setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    setShowAddressForm(false);
  };

  const handleAddPayment = () => {
    if (!newPayment.cardNumber || !newPayment.cardHolderName || !newPayment.expiryDate || !newPayment.cvv) {
      alert('Please fill out all payment fields.');
      return;
    }
    if (user) {
      axios.post(`http://localhost:8080/api/payment-methods/create`, {
        ...newPayment,
        user: { id: user.id }
      })
      .then(response => setPayments([...payments, response.data]))
      .catch(error => console.error('Error adding payment method:', error));
    } else {
      setPayments([...payments, { ...newPayment, id: Date.now() }]);
    }
    setNewPayment({ cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' });
    setShowPaymentForm(false);
  };

  const handleUpdateAddress = (addressId) => {
    if (!editAddress.street || !editAddress.city || !editAddress.state || !editAddress.zipCode || !editAddress.country) {
      alert('Please fill out all address fields.');
      return;
    }
    if (user) {
      axios.put(`http://localhost:8080/api/addresses/${addressId}`, {
        ...editAddress,
        user: { id: user.id }
      })
      .then(response => {
        setAddresses(addresses.map(address => address.id === addressId ? response.data : address));
        setEditAddress(null);
      })
      .catch(error => console.error('Error updating address:', error));
    } else {
      setAddresses(addresses.map(address => address.id === addressId ? editAddress : address));
      setEditAddress(null);
    }
  };

  const handleDeleteAddress = (addressId) => {
    if (user) {
      axios.delete(`http://localhost:8080/api/addresses/${addressId}`)
        .then(() => setAddresses(addresses.filter(address => address.id !== addressId)))
        .catch(error => console.error('Error deleting address:', error));
    } else {
      setAddresses(addresses.filter(address => address.id !== addressId));
    }
  };

  const handleUpdatePayment = (paymentId) => {
    if (!editPayment.cardNumber || !editPayment.cardHolderName || !editPayment.expiryDate || !editPayment.cvv) {
      alert('Please fill out all payment fields.');
      return;
    }
    if (user) {
      axios.put(`http://localhost:8080/api/payment-methods/${paymentId}`, {
        ...editPayment,
        user: { id: user.id }
      })
      .then(response => {
        setPayments(payments.map(payment => payment.id === paymentId ? response.data : payment));
        setEditPayment(null);
      })
      .catch(error => console.error('Error updating payment method:', error));
    } else {
      setPayments(payments.map(payment => payment.id === paymentId ? editPayment : payment));
      setEditPayment(null);
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (user) {
      axios.delete(`http://localhost:8080/api/payment-methods/${paymentId}`)
        .then(() => setPayments(payments.filter(payment => payment.id !== paymentId)))
        .catch(error => console.error('Error deleting payment method:', error));
    } else {
      setPayments(payments.filter(payment => payment.id !== paymentId));
    }
  };

  const handleConfirmOrder = async () => {
    setShowConfirmModal(false);
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];

    const newOrder = {
      user: user ? user.id : 'guest',
      items: cart,
      address: selectedAddress,
      payment: selectedPayment,
      date: new Date().toISOString(),
    };

    orderHistory.push(newOrder);
    cart.forEach(item => {
      soldItems.push({ product: item, merchant: item.seller });
    });

    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    localStorage.setItem('soldItems', JSON.stringify(soldItems));
    localStorage.removeItem('cartItems');
    setCart([]);

    for (const item of cart) {
      try {
        const productResponse = await axios.get(`http://localhost:8080/api/products/${item.id}`);
        const product = productResponse.data;
          const newStock = product.stock - item.quantity;

        if (newStock < 0) {
          alert(`Cannot complete order. Only ${product.stock} items of ${product.name} in stock.`);
          return;
        }

          if (newStock === 0) {
          await axios.delete(`http://localhost:8080/api/products/${item.id}`);
          } else {              
            const updatedProduct = {
                ...product, // Spread the current product properties
                stock: newStock // Only update the stock property
            };
            await axios.put(`http://localhost:8080/api/products/${item.id}`, updatedProduct);
            }
      } catch (error) {
        console.error('Error updating product stock:', error);
      }
    }

    window.location.reload();
  };

  const handleShowConfirmModal = () => {
    if (selectedAddress && selectedPayment) {
      setShowConfirmModal(true);
    } else {
      alert('Please select an address and a payment method.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    if (query) {
      setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  return (
    <Container className="mt-4">
      <Navbar products={products} onSearch={handleSearch} />
      <h2 style={{ marginTop: '50px' }}>Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart text-center">
          <p>Your cart is empty. Start shopping now!</p>
          <Button variant="primary" onClick={() => navigate('/homepage')}>Shop Now</Button>
        </div>
      ) : (
        <div>
          <Row>
            {cart.map(item => (
              <Col md={4} key={item.id} className="mb-4">
                <Card>
                <div onClick={() => navigate(`/products/${item.id}`)} style={{ cursor: 'pointer' }}>
                    <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="d-flex align-items-center justify-content-between">
                        <Button variant="outline-secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, -1); }}>-</Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button variant="outline-secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, 1); }}>+</Button>
                    </div>
                    <Card.Text className="mt-2">${(item.price * item.quantity).toFixed(2)}</Card.Text>
                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item.id); }}>Remove</Button>
                    </Card.Body>
                </div>
                </Card>
              </Col>
            ))}
          </Row>
          <h3 className="mt-4">Addresses</h3>
          <ListGroup className="mb-4">
            {addresses.map((address, index) => (
              <ListGroup.Item
                key={index}
                className={`d-flex justify-content-between align-items-center ${selectedAddress?.id === address.id ? 'bg-secondary' : ''}`}
                onClick={() => setSelectedAddress(address)}
              >
                <span>{address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}</span>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => setEditAddress(address)}>Edit</Button>
                  <Button variant="outline-danger" size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }}>Delete</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {editAddress && (
            <Form className="mb-4">
              <Form.Group controlId="formAddress">
                <Form.Label>Update Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Street"
                  value={editAddress.street}
                  onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={editAddress.city}
                  onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={editAddress.state}
                  onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Zip Code"
                  value={editAddress.zipCode}
                  onChange={(e) => setEditAddress({ ...editAddress, zipCode: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Country"
                  value={editAddress.country}
                  onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                  className="mt-2"
                />
              </Form.Group>
              <Button variant="primary" className="mt-2" onClick={() => handleUpdateAddress(editAddress.id)}>Update Address</Button>
            </Form>
          )}
          {!showAddressForm ? (
            <Button variant="primary" onClick={() => setShowAddressForm(true)}>Add Address</Button>
          ) : (
            <Form className="mb-4">
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="mt-2"
                />
              </Form.Group>
              <Button variant="primary" className="mt-2" onClick={handleAddAddress}>Add Address</Button>
            </Form>
          )}
          <h3 className="mt-4">Payment Methods</h3>
          <ListGroup className="mb-4">
            {payments.map((payment, index) => (
              <ListGroup.Item
                key={index}
                className={`d-flex justify-content-between align-items-center ${selectedPayment?.id === payment.id ? 'bg-secondary' : ''}`}
                onClick={() => setSelectedPayment(payment)}
              >
                <span>{payment.cardHolderName}, {payment.cardNumber}</span>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => setEditPayment(payment)}>Edit</Button>
                  <Button variant="outline-danger" size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); handleDeletePayment(payment.id); }}>Delete</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {editPayment && (
            <Form className="mb-4">
              <Form.Group controlId="formPayment">
                <Form.Label>Update Payment Method</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Card Number"
                  value={editPayment.cardNumber}
                  onChange={(e) => setEditPayment({ ...editPayment, cardNumber: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="Card Holder Name"
                  value={editPayment.cardHolderName}
                  onChange={(e) => setEditPayment({ ...editPayment, cardHolderName: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Expiry Date"
                  value={editPayment.expiryDate}
                  onChange={(e) => setEditPayment({ ...editPayment, expiryDate: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="CVV"
                  value={editPayment.cvv}
                  onChange={(e) => setEditPayment({ ...editPayment, cvv: e.target.value })}
                  className="mt-2"
                />
              </Form.Group>
              <Button variant="primary" className="mt-2" onClick={() => handleUpdatePayment(editPayment.id)}>Update Payment</Button>
            </Form>
          )}
          {!showPaymentForm ? (
            <Button variant="primary" onClick={() => setShowPaymentForm(true)}>Add Payment Method</Button>
          ) : (
            <Form className="mb-4">
              <Form.Group controlId="formPayment">
                <Form.Label>Payment</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Card Number"
                  value={newPayment.cardNumber}
                  onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="Card Holder Name"
                  value={newPayment.cardHolderName}
                  onChange={(e) => setNewPayment({ ...newPayment, cardHolderName: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Expiry Date"
                  value={newPayment.expiryDate}
                  onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                  className="mt-2"
                />
                <Form.Control
                  type="text"
                  placeholder="CVV"
                  value={newPayment.cvv}
                  onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                  className="mt-2"
                />
              </Form.Group>
              <Button variant="primary" className="mt-2" onClick={handleAddPayment}>Add Payment Method</Button>
            </Form>
          )}
          <div className="d-flex justify-content-end mt-4">
            <Button variant="success" onClick={handleShowConfirmModal}>Confirm Order</Button>
          </div>
        </div>
      )}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to confirm the order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>Close</Button>
          <Button variant="primary" onClick={handleConfirmOrder}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
