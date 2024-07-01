import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Homepage.css';
import ProductCard from '../Product/ProductCard';
import Navbar from '../Navbar/Navbar';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  return (
    <div className="homepage">
      <Navbar products={products} onSearch={handleSearch} />
      <div className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
