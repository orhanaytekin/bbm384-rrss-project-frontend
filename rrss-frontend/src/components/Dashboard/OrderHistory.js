import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

    const fetchOrderHistory = () => {
      const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
      setOrderHistory(orders);
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchUsers();
    fetchOrderHistory();
    fetchProducts();
  }, []);

  const handleBuyAgain = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === product.id);
    if (itemIndex > -1) {
      cartItems[itemIndex].quantity += product.quantity;
    } else {
      cartItems.push({ ...product, quantity: product.quantity });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart');
  };

  const handleProductClick = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      navigate(`/products/${productId}`);
    } else {
      alert('This product is currently out of stock or no longer available.');
    }
  };

  const userOrders = orderHistory.filter(order => order.user === (user ? user.id : 'guest'));

  return (
    <Container className="order-history mt-4">
      <h2>Order History</h2>
      {userOrders.length === 0 ? (
        <p>No order history available.</p>
      ) : (
        userOrders.map(order => (
          <div key={order.date} className="order">
            <h4>Order Date: {new Date(order.date).toLocaleDateString()}</h4>
            <h5>Address: {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipCode}, {order.address.country}</h5>
            <h5>Payment: {order.payment.cardHolderName}, {order.payment.cardNumber}</h5>
            <Row className="mt-3">
              {order.items.map(item => (
                <Col md={4} key={item.id} className="mb-4">
                  <Card onClick={() => handleProductClick(item.id)} style={{ cursor: 'pointer' }}>
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <Card.Text>Quantity: {item.quantity}</Card.Text>
                      <Card.Text>Price: ${(item.price * item.quantity).toFixed(2)}</Card.Text>
                      <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleBuyAgain(item); }}>Buy Again</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
