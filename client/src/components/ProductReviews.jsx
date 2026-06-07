import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import { getProductReviews, postReview } from '../services/reviewService';
import { usePopup } from '../contexts/PopupContext';
import Button from './Button';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showPopup } = usePopup();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getProductReviews(productId, 0, 20); // fetch first 20 for now
      if (res && res.result && res.result.content) {
        setReviews(res.result.content);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showPopup({
        type: 'error',
        title: 'Chưa đăng nhập',
        message: 'Bạn cần đăng nhập để gửi đánh giá.',
        confirmText: 'Đóng'
      });
      return;
    }

    try {
      setSubmitting(true);
      await postReview(productId, rating, comment);
      showPopup({
        type: 'success',
        title: 'Thành công',
        message: 'Cảm ơn bạn đã gửi đánh giá.',
        confirmText: 'Đóng'
      });
      setComment('');
      setRating(5);
      fetchReviews(); // refresh
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể gửi đánh giá. Có thể bạn chưa mua sản phẩm này.',
        confirmText: 'Đóng'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
        <MessageSquare className="mr-3 text-blue-600" size={28} /> 
        Đánh giá & Nhận xét
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Write Review Form */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
            {!user ? (
              <p className="text-sm text-gray-500 mb-4">Vui lòng đăng nhập để đánh giá sản phẩm này.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Đánh giá sao</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nhận xét</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    required
                  ></textarea>
                </div>
                <Button type="submit" disabled={submitting} className="w-full flex justify-center items-center">
                  <Send size={18} className="mr-2" />
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 shrink-0 overflow-hidden">
                        {review.avatarUrl ? (
                          <img src={review.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{review.username}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
