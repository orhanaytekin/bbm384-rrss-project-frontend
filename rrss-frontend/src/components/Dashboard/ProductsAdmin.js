import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProductsAdmin.css';

const ProductsAdmin = () => {
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

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="products-admin">
      <h2>All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> {product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsAdmin;
