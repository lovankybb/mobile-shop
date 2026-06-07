import React from 'react';
import '../pages/HomePage.css';

const ProductSkeleton = () => {
  return (
    <div className="hp-prod-card animate-pulse">
      <div className="hp-prod-thumb bg-gray-200"></div>
      <div className="hp-prod-info">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
