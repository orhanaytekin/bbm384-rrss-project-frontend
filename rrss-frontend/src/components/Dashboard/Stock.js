import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Stock.css';

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data.filter(product => product.user.username === localStorage.getItem('username')));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setProductDetails({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:8080/api/products/${editProductId}`, productDetails);
      setProducts(products.map(product => product.id === editProductId ? { ...product, ...productDetails } : product));
      setEditProductId(null);
      setProductDetails({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const userId = await fetchUserId();
      const newProduct = { ...productDetails, user: { id: userId } };
      const response = await axios.post('http://localhost:8080/api/products/create', newProduct);
      setProducts([...products, response.data]);
      setShowAddForm(false);
      setProductDetails({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/users');
      const user = response.data.find(user => user.username === localStorage.getItem('username'));
      return user.id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  return (
    <div className="stock">
      <h2>Stock Management</h2>
      <button className="add-product-button" onClick={() => setShowAddForm(true)}>Add Product</button>
      {showAddForm && (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={productDetails.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={productDetails.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productDetails.price}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={productDetails.stock}
            onChange={handleInputChange}
          />
          <button onClick={handleAddProduct}>Add Product</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
      <ul>
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <li>
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <button className="edit-button" onClick={() => handleEditProduct(product)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
            {editProductId === product.id && (
              <div className="edit-product-form">
                <h3>Update Product</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={productDetails.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={productDetails.description}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productDetails.price}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={productDetails.stock}
                  onChange={handleInputChange}
                />
                <button onClick={handleUpdateProduct}>Save</button>
                <button onClick={() => setEditProductId(null)}>Cancel</button>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Stock;
