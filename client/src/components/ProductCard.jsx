import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/HomePage.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="hp-prod-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="hp-prod-thumb">
        <img className="hp-prod-image" src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
      </div>
      <div className="hp-prod-info">
        <h3 className="hp-prod-name">{product.name}</h3>
        <p className="hp-prod-specs">
          {product.brandName || 'Điện thoại'} | {product.categoryName || 'Tiêu chuẩn'}
        </p>
        <div className="hp-prod-price">{formatPrice(product.salePrice || product.price || 0)}</div>
        <button className="hp-prod-btn">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
