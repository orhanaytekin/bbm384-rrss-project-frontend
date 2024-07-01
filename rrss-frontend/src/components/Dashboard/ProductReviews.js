import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProductReviews.css';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [overallAverageRating, setOverallAverageRating] = useState(0);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/api/auth/users');
        const currentUser = usersResponse.data.find(user => user.username === username);

        const productsResponse = await axios.get('http://localhost:8080/api/products');
        const merchantProducts = productsResponse.data.filter(product => product.user.id === currentUser.id);

        const reviewsResponse = await axios.get('http://localhost:8080/api/reviews');
        const merchantReviews = reviewsResponse.data.filter(review =>
          merchantProducts.some(product => product.id === review.product.id)
        );

        // Calculate average ratings
        const productRatings = {};
        merchantReviews.forEach(review => {
          const { product, rating } = review;
          if (!productRatings[product.id]) {
            productRatings[product.id] = { sum: 0, count: 0 };
          }
          productRatings[product.id].sum += rating;
          productRatings[product.id].count += 1;
        });

        const calculatedAverageRatings = {};
        let totalSum = 0;
        let totalCount = 0;

        for (const productId in productRatings) {
          const { sum, count } = productRatings[productId];
          calculatedAverageRatings[productId] = (sum / count).toFixed(2);
          totalSum += sum;
          totalCount += count;
        }

        const overallAverage = (totalSum / totalCount).toFixed(2);

        setReviews(merchantReviews);
        setAverageRatings(calculatedAverageRatings);
        setOverallAverageRating(overallAverage);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [username]);

  return (
    <div className="product-reviews">
      <h2>Product Reviews</h2>
      <h4>Overall Average Rating: {overallAverageRating}</h4>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p><strong>Product:</strong> {review.product.name}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Average Rating for this Product:</strong> {averageRatings[review.product.id]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductReviews;
