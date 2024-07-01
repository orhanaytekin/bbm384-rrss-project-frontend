import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { Container, Form, Card, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const Recommendations = () => {
  const [algorithm, setAlgorithm] = useState(localStorage.getItem('recommendationAlgorithm') || 'orderHistory');
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProducts();
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchRecommendedProducts = () => {
      let recommended = [];

      if (algorithm === 'orderHistory') {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const orderedProductIds = orderHistory.flatMap(order => order.items.map(item => item.id));
        recommended = products.filter(product => orderedProductIds.includes(product.id));
      } else if (algorithm === 'mostReviewed') {
        recommended = products
          .map(product => ({
            ...product,
            reviewCount: reviews.filter(review => review.product.id === product.id).length
          }))
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 10);
      } else if (algorithm === 'highestRated') {
        recommended = products
          .map(product => ({
            ...product,
            averageRating: reviews.filter(review => review.product.id === product.id)
              .reduce((acc, review) => acc + review.rating, 0) / reviews.filter(review => review.product.id === product.id).length
          }))
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 10);
      }

      setRecommendedProducts(recommended);
    };

    if (products.length > 0 && reviews.length > 0) {
      fetchRecommendedProducts();
    }
  }, [algorithm, products, reviews]);

  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    setAlgorithm(newAlgorithm);
    localStorage.setItem('recommendationAlgorithm', newAlgorithm);
  };

  return (
    <Container className="mt-4">
      <h2>Recommendations</h2>
      <Form.Group controlId="recommendationAlgorithm">
        <Form.Label>Select Recommendation Algorithm</Form.Label>
        <Form.Control as="select" value={algorithm} onChange={handleAlgorithmChange}>
          <option value="orderHistory">Based on Order History</option>
          <option value="mostReviewed">Most Reviewed</option>
          <option value="highestRated">Highest Rated</option>
        </Form.Control>
          </Form.Group>
          <p>      </p>
      <h3>Preview</h3>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {recommendedProducts.map(product => (
          <SwiperSlide key={product.id}>
            <Card className="mr-3" style={{ minWidth: '200px' }}>
              <Card.Img variant="top" src={product.imageUrl} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>${product.price.toFixed(2)}</Card.Text>
                {/* <div className="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar key={index} color={index < product.averageRating ? 'gold' : 'grey'} />
                  ))}
                </div> */}
                <Button variant="primary" onClick={() => (product)}>Add to Cart</Button>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default Recommendations;
