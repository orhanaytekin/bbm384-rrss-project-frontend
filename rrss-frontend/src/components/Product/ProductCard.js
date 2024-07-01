import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import '../../styles/ProductCard.css';
import grass from './grass.jpeg';

const fetchImageUrl = async (description) => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: description, per_page: 1 },
      headers: {
        Authorization: `Client-ID EmJ00m3mRYubkwQjjqiqAc5axwM_iA9-nocNSv59tQo`,
      },
    });
    if (response.data.results.length > 0) {
      return response.data.results[0].urls.small;
    } else {
      return grass; // Fallback to default image
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    return grass; // Fallback to default image
  }
};

const ProductCard = ({ product }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [numberOfReviews, setNumberOfReviews] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await fetchImageUrl(product.description);
      setImageUrl(imageUrl);
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reviews`);
        const productReviews = response.data.filter(review => review.product.id === product.id);
        setNumberOfReviews(productReviews.length);
        if (productReviews.length > 0) {
          const avgRating = (productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length).toFixed(1);
          setAverageRating(avgRating);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchImage();
    fetchAverageRating();
  }, [product.description, product.id]);

  const reviewText = numberOfReviews === 1 ? '1 review' : `${numberOfReviews} reviews`;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <img src={imageUrl} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="product-price">${product.price}</p>
        {averageRating && (
          <div className="rating-vertical">
            <div className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} color={index < averageRating ? 'gold' : 'grey'} />
              ))}
            </div>
            <div className="review-text">
              <span>{averageRating} ({reviewText})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
export { fetchImageUrl };
