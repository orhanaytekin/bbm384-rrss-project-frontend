import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../styles/SalesReport.css';

const SalesReport = () => {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [soldItems, setSoldItems] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users');
        setMerchants(response.data.filter(user => user.role === 'MERCHANT'));
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
    };

    fetchMerchants();
  }, []);

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
    const fetchSoldItems = async () => {
      if (selectedMerchant) {
        try {
          const soldItemsData = JSON.parse(localStorage.getItem('soldItems')) || [];
          const filteredItems = soldItemsData.filter(item => item.product.user.id === selectedMerchant.id);
          setSoldItems(filteredItems);
        } catch (error) {
          console.error('Error fetching sold items:', error);
        }
      }
    };

    fetchSoldItems();
  }, [selectedMerchant]);

  useEffect(() => {
    const calculateTotalSales = () => {
      const total = soldItems.reduce((acc, item) => acc + item.product.price * item.product.quantity, 0);
      setTotalSales(total);
    };

    calculateTotalSales();
  }, [soldItems]);

  const generatePDF = () => {
    if (!selectedMerchant) return;

    const doc = new jsPDF();
    doc.text(`Sales Report for ${selectedMerchant.username}`, 20, 10);
    doc.text(`Total Sales: $${totalSales.toFixed(2)}`, 20, 20);

    const tableColumn = ["Product Name", "Description", "Quantity Sold", "Total Price", "Current Stock", "Current Price"];
    const tableRows = [];

    soldItems.forEach(item => {
      const product = products.find(product => product.id === item.product.id);
      const productData = [
        item.product.name,
        item.product.description,
        item.quantity,
        (item.product.price * item.product.quantity).toFixed(2),
        product ? product.stock : 'N/A',
        product ? product.price : 'N/A'
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`sales_report_${selectedMerchant.username}.pdf`);
  };

  const handleMerchantChange = async (e) => {
    const merchant = JSON.parse(e.target.value);
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/users`);
      const user = response.data.find(user => user.username === merchant.username);
      setSelectedMerchant(user);
    } catch (error) {
      console.error('Error fetching merchant details:', error);
    }
  };

  return (
    <div className="sales-report">
      <h2>Generate Sale Report</h2>
      <select onChange={handleMerchantChange} value={selectedMerchant ? JSON.stringify(selectedMerchant) : ''}>
        <option value="" disabled>Select a Merchant</option>
        {merchants.map((merchant) => (
          <option key={merchant.id} value={JSON.stringify(merchant)}>
            {merchant.username}
          </option>
        ))}
      </select>
      <button onClick={generatePDF} disabled={!selectedMerchant}>Generate Report</button>
      {selectedMerchant && (
        <Container className="sold-items-container mt-4">
          <h2>Sold Items</h2>
          <h4>Total Sales: ${totalSales.toFixed(2)}</h4>
          {soldItems.length === 0 ? (
            <p>No sold items for this merchant.</p>
          ) : (
            <Row>
              {soldItems.map((item, index) => {
                const product = products.find(product => product.id === item.product.id);
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
          )}
        </Container>
      )}
    </div>
  );
};

export default SalesReport;
