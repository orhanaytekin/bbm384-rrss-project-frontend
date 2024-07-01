import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../../styles/ReviewList.css';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/api/auth/users');
        const currentUser = usersResponse.data.find(user => user.username === username);
        if (currentUser) {
          setRole(currentUser.role);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get('http://localhost:8080/api/reviews');
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchUserRole();
    fetchReviews();
  }, [username]);

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`);
      setReviews(reviews.filter(review => review.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container className="review-list-container mt-4">
      <h3>All Reviews</h3>
      <Row>
        {reviews.map((review) => (
          <Col md={6} key={review.id} className="mb-4">
            <Card className="review-card" onClick={() => handleCardClick(review.product.id)}>
              <Card.Body className="text-center">
                <Card.Title>{review.product.name}</Card.Title>
                <Card.Text><strong>User:</strong> {review.user.username}</Card.Text>
                <Card.Text><strong>Rating:</strong> {review.rating}</Card.Text>
                <Card.Text><strong>Comment:</strong> {review.comment}</Card.Text>
                {(role === 'COMMUNITY_MANAGER' || role === 'ADMIN' || review.user.username === username) && (
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteReview(review.id);
                    }}
                  >
                    <FaTrash />
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ReviewList;
