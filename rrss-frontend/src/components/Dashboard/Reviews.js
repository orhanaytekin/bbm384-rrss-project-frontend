import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import '../../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews');
        setReviews(response.data.filter(review => review.user.username === username));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

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

  const handleEditReview = (review) => {
    setEditReviewId(review.id);
    setEditReviewContent(review.comment);
    setEditRating(review.rating);
    window.scrollTo(0, 0);
  };

  const handleUpdateReview = async () => {
    if (!editReviewContent || editRating < 1) {
      alert("Please provide a valid review and rating.");
      return;
    }
    try {
      const updatedReview = { comment: editReviewContent, rating: editRating };
      const response = await axios.put(`http://localhost:8080/api/reviews/${editReviewId}`, updatedReview);
      setReviews(reviews.map(review => review.id === editReviewId ? { ...review, ...response.data } : review));
      setEditReviewId(null);
      setEditReviewContent('');
      setEditRating(0);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleStarClick = (nextValue) => {
    setEditRating(nextValue);
  };

  const handleReviewClick = (productId) => {
    if (!editReviewId) {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <Container className="reviews mt-4">
      <h2>Your Reviews</h2>
      <Row>
        {reviews.map((review) => (
          <Col md={6} key={review.id} className="mb-4">
            <Card
              className={`review-card ${editReviewId === review.id ? 'non-clickable' : 'clickable'}`}
              onClick={() => handleReviewClick(review.product.id)}
            >
              <Card.Body className="text-center">
                <Card.Title>{review.product.name}</Card.Title>
                <div className="rating mb-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar key={index} color={index < review.rating ? 'gold' : 'grey'} />
                  ))}
                </div>
                <Card.Text>{review.comment}</Card.Text>
                <div className="card-actions d-flex justify-content-center">
                  {editReviewId === review.id ? (
                    <Form className="w-100">
                      <Form.Group controlId="formReviewComment">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editReviewContent}
                          onChange={(e) => setEditReviewContent(e.target.value)}
                          className="mb-2"
                        />
                      </Form.Group>
                      <div className="rating mb-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <FaStar
                            key={index}
                            color={index < editRating ? 'gold' : 'grey'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarClick(index + 1);
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        ))}
                      </div>
                      <Button
                        variant="primary"
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateReview();
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditReviewId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <FaEdit
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditReview(review);
                        }}
                      />
                      <FaTrash
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReview(review.id);
                        }}
                      />
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Reviews;
