import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../Navbar/Navbar';
import '../../styles/ProductPage.css';
import { fetchImageUrl } from '../Product/ProductCard';
import { Modal, Button, Card } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [recommendedImages, setRecommendedImages] = useState({});


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
        const image = await fetchImageUrl(response.data.description);
        setImageUrl(image);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews');
        const productReviews = response.data.filter(review => review.product.id === parseInt(id));
        setReviews(productReviews);
        setAllReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProduct();
    fetchReviews();
    fetchAllProducts();

    const fetchCart = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCart(cartItems);
    };

    const fetchUser = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/users/username/${username}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCart();
    fetchUser();
  }, [id]);

  useEffect(() => {
  const fetchRecommendedProducts = async () => {
    const algorithm = localStorage.getItem('recommendationAlgorithm') || 'orderHistory';
    let recommended = [];

    if (algorithm === 'orderHistory') {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      const orderedProductIds = orderHistory.flatMap(order => order.items.map(item => item.id));
      recommended = allProducts.filter(product => orderedProductIds.includes(product.id));
    } else if (algorithm === 'mostReviewed') {
      recommended = allProducts
        .map(product => ({
          ...product,
          reviewCount: allReviews.filter(review => review.product.id === product.id).length
        }))
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 10);
    } else if (algorithm === 'highestRated') {
      recommended = allProducts
        .map(product => {
          const productReviews = allReviews.filter(review => review.product.id === product.id);
          const averageRating = productReviews.length > 0
            ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length
            : 0;
          return {
            ...product,
            averageRating
          };
        })
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 10);
    }

    setRecommendedProducts(recommended);

    const images = {};
    for (const product of recommended) {
      const image = await fetchImageUrl(product.description);
      images[product.id] = image;
    }
    setRecommendedImages(images);
  };

  if (allProducts.length > 0 && allReviews.length > 0) {
    fetchRecommendedProducts();
  }
}, [allProducts, allReviews]);



  const handleAddToCart = (item, recommended) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      cartItems[itemIndex].quantity += quantity;
    } else {
      cartItems.push({ ...item, quantity });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCart(cartItems);
    // if recommended product is added to cart, reload the page to show updated recommendations

    if (recommended) {
      // Scroll down to "Users also liked" section
      const recommendedSection = document.querySelector('.recommended-products-section');
      if (recommendedSection) {
        recommendedSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    else {
      // Scroll up to top of the page
      window.location.reload();
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) 
    : "No ratings";

  const scrollToReviews = () => {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddReviewClick = () => {
    if (!user) {
      setShowModal(true); // Show the modal if the user is not logged in
      return;
    }

    handleAddReview();
  };

  const handleAddReview = async () => {
    if (!newReview || newRating < 1) {
      alert("Please provide a valid review and rating.");
      return;
    }
    try {
      const review = {
        comment: newReview,
        rating: newRating,
        user: { id: user.id },
        product: { id: parseInt(id) }
      };
      const response = await axios.post('http://localhost:8080/api/reviews/create', review);
      setReviews([...reviews, response.data]);
      setNewReview('');
      setNewRating(0);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditReviewId(review.id);
    setEditReviewContent(review.comment);
    setEditRating(review.rating);
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

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="homepage">
      <Navbar products={allProducts} onSearch={(query) => {
        if (query) {
          setAllProducts(allProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase())));
        } else {
          setAllProducts(allProducts);
        }
      }}/>
      <div className="container product-page mt-4">
        {product && (
          <div className="row">
            <div className="col-md-6">
              <img src={imageUrl} alt={product.name} className="img-fluid product-image" />
            </div>
            <div className="col-md-6">
              <h2>{product.name}</h2>
              <div className="rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar key={index} color={index < averageRating ? 'gold' : 'grey'} />
                ))}
                <button className="btn btn-link p-0 ml-2" onClick={scrollToReviews}>{averageRating} ({reviews.length} reviews)</button>
              </div>
              <h4>${(product.price * quantity).toFixed(2)}</h4>
              <p>{product.description}</p>
              <p><strong>Seller:</strong> {product.user.username}</p>
              <div className="d-flex align-items-center my-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(-1)}>-</button>
                <span className="mx-3">{quantity}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product, false)}>Add to Cart</button>
            </div>
          </div>
        )}
        <div className="reviews-section mt-5">
          <h3>Reviews</h3>
          <div className="add-review mb-4">
            <h4>Add Review as {user?.username}</h4>
            <textarea
              className="form-control"
              rows="3"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <div className="rating mt-2">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  color={index < newRating ? 'gold' : 'grey'}
                  onClick={() => setNewRating(index + 1)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <button className="btn btn-primary mt-2" onClick={handleAddReviewClick}>Submit Review</button>
          </div>
          <ul className="list-group">
            {reviews.map(review => (
              <li key={review.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <p><strong>{review.user.username}</strong> ({review.rating} <FaStar color="gold" />): {review.comment}</p>
                  </div>
                  <div>
                    {user?.id === review.user.id && (
                      <>
                        <FaEdit
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                          onClick={() => handleEditReview(review)}
                        />
                        <FaTrash
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDeleteReview(review.id)}
                        />
                      </>
                    )}
                    {user?.role === 'COMMUNITY_MANAGER' && user?.id !== review.user.id && (
                      <FaTrash
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteReview(review.id)}
                      />
                    )}
                  </div>
                </div>
                {editReviewId === review.id && (
                  <div className="edit-review mt-2">
                    <textarea
                      className="form-control"
                      rows="2"
                      value={editReviewContent}
                      onChange={(e) => setEditReviewContent(e.target.value)}
                    />
                    <div className="rating mt-2">
                      {Array.from({ length: 5 }, (_, index) => (
                        <FaStar
                          key={index}
                          color={index < editRating ? 'gold' : 'grey'}
                          onClick={() => setEditRating(index + 1)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                    <button className="btn btn-primary mt-2" onClick={handleUpdateReview}>Update Review</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {user ? (
  <div className="recommended-products-section mt-5">
    <h3>Users also liked</h3>
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {recommendedProducts.map(product => (
        <SwiperSlide key={product.id}>
          <Card className="mr-3" style={{ minWidth: '200px', cursor: 'pointer' }} onClick={() => {
            navigate(`/products/${product.id}`);
            window.location.reload();
          }}>
            <Card.Img variant="top" src={recommendedImages[product.id]} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>${product.price.toFixed(2)}</Card.Text>
              {/* <div className="rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar key={index} color={index < product.averageRating ? 'gold' : 'grey'} />
                ))}
              </div> */}
              <Button variant="primary" onClick={() => handleAddToCart(product, true)}>Add to Cart</Button>
            </Card.Body>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
) : (
  <div className="recommended-products-section mt-5">
    <h3>If you want to see personalized recommendations, please <a href="/login">login</a> or <a href="/register">register</a>.</h3>
  </div>
)}

      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Guest User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Only registered users can add reviews. Please <a href="/register">register</a> or <a href="/login">login</a>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductPage;
