import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [userId, setUserId] = useState('');
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get('http://localhost:8080/api/auth/users');
        const user = response.data.find(user => user.username === username);
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/payment-methods');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchUserId();
    fetchPayments();
  }, []);

  const handleAddOrUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
        user: { id: userId },
      };

      if (editingPaymentId) {
        const response = await axios.put(`http://localhost:8080/api/payment-methods/${editingPaymentId}`, paymentData);
        setPayments(payments.map(payment => (payment.id === editingPaymentId ? response.data : payment)));
        setEditingPaymentId(null);
      } else {
        const response = await axios.post('http://localhost:8080/api/payment-methods/create', paymentData);
        setPayments([...payments, response.data]);
      }

      setCardNumber('');
      setCardHolderName('');
      setExpiryDate('');
      setCvv('');
    } catch (error) {
      console.error(`Error ${editingPaymentId ? 'updating' : 'adding'} payment method:`, error);
    }
  };

  const handleEditPayment = (payment) => {
    setCardNumber(payment.cardNumber);
    setCardHolderName(payment.cardHolderName);
    setExpiryDate(payment.expiryDate);
    setCvv(payment.cvv);
      setEditingPaymentId(payment.id);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/payment-methods/${id}`);
      setPayments(payments.filter(payment => payment.id !== id));
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleCancelEdit = () => {
    setCardNumber('');
    setCardHolderName('');
    setExpiryDate('');
    setCvv('');
    setEditingPaymentId(null);
  };

  const userPayments = payments.filter(payment => payment.user.id === userId);

  return (
    <div className="payments-container">
      <h2>Payment Methods</h2>
      <form onSubmit={handleAddOrUpdatePayment} className="payment-form">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Card Holder Name"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
        <button type="submit" className="btn-submit">
          {editingPaymentId ? 'Update' : 'Add'} Payment Method
        </button>
        {editingPaymentId && (
          <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <div className="payments-list">
        {userPayments.map((payment) => (
          <div key={payment.id} className="payment-card">
            <p>Card Number: {payment.cardNumber}</p>
            <p>Card Holder Name: {payment.cardHolderName}</p>
            <p>Expiry Date: {payment.expiryDate}</p>
            <button className="btn-edit" onClick={() => handleEditPayment(payment)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDeletePayment(payment.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
