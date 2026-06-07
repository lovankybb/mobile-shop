import { useState, useEffect } from 'react';

export const useDelayedLoading = (isLoading, delay = 250) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      // Bắt đầu đếm ngược delay, nếu sau delay mà vẫn loading thì mới show skeleton
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      // Nếu loading xong sớm (trước delay), hoặc đã xong thì tắt ngay lập tức
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return showLoading;
};
