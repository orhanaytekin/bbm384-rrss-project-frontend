import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/SoldItems.css';

const SoldItems = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
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
    const fetchSoldItems = async () => {
      try {
        const soldItemsData = JSON.parse(localStorage.getItem('soldItems')) || [];
        console.log('userId:', userId);
          console.log('soldItemsData:', soldItemsData);
          // write out the first item in sold items data
            console.log('soldItemsData[0]:', soldItemsData[0]);
          const filteredItems = soldItemsData.filter(item => item.product.user.id === userId);
          console.log('filteredItems:', filteredItems);
        setSoldItems(filteredItems);
      } catch (error) {
        console.error('Error fetching sold items:', error);
      }
    };

    if (userId) {
      fetchSoldItems();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateTotalSales = () => {
      const total = soldItems.reduce((acc, item) => acc + item.product.price * item.product.quantity, 0);
      setTotalSales(total);
    };

    calculateTotalSales();
  }, [soldItems]);

  return (
    <Container className="sold-items-container mt-4">
      <h2>Sold Items</h2>
      <h4>Total Sales: ${totalSales.toFixed(2)}</h4>
      <Row>
        {soldItems.map((item, index) => {
          const product = products.find(product => product.id === item.id);
          return (
            <Col md={6} key={index} className="mb-4">
              <Card className="sold-item-card">
                <Card.Body>
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text>{item.product.description}</Card.Text>
                  <Card.Text><strong>Quantity Sold:</strong> {item.product.quantity}</Card.Text>
                  <Card.Text><strong>Total Price:</strong> ${(item.product.price * item.product.quantity).toFixed(2)}</Card.Text>
                  {product && (
                    <>
                      <Card.Text><strong>Current Stock:</strong> {product.stock}</Card.Text>
                      <Card.Text><strong>Current Price:</strong> ${product.price}</Card.Text>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default SoldItems;
