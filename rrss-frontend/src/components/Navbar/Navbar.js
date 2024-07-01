import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from './logo/logo.jpg';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const Navbar = ({ products = [], onSearch, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    };

    fetchCartCount();
  }, []);

  const handleProfileClick = () => {
    if (!localStorage.getItem('username')) {
      setShowModal(true);
      return;
    }

    const username = localStorage.getItem('username');
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

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
    setSuggestions([]); // Clear suggestions
    navigate('/homepage', { state: { searchQuery } });
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setSuggestions([]);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <nav className="navbar">
      <Link to="/homepage" className="navbar-logo">
        <img src={logo} alt="ShopSmart" />
      </Link>
      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map(suggestion => (
              <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="navbar-icons">
        <Link to="/cart">
          <FaShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <FaUser size={24} onClick={handleProfileClick} style={{ cursor: 'pointer', marginLeft: '10px' }} />
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Guest User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Only registered users can access the profile. Please <a href="/register">register</a> or <a href="/login">login</a>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
};

export default Navbar;
