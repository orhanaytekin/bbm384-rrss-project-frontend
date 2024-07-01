import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import '../../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <Layout>
      <div className="product-list-container">
        <h2>My Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ProductList;
