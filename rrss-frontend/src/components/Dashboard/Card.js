import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Card.css';

const Card = ({ icon, title, navigateTo, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(navigateTo);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default Card;
