import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetailById } from '../services/productService';
import Button from '../components/Button';
import { Loader, ServerCrash, ShoppingCart, ChevronLeft, Star } from 'lucide-react';
import { usePopup } from '../contexts/PopupContext';
import { useCart } from '../contexts/CartContext';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductDetailById(id);
        const data = res.result || res;
        setProduct(data);
        
        // Initialize default selections
        if (data.variants && data.variants.length > 0) {
          setSelectedVersion(data.variants[0].versionName);
          setSelectedColor(data.variants[0].colorName);
        }
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader size={40} className="text-blue-600 animate-spin" />
        <span className="font-medium text-gray-500">Đang tải thông tin sản phẩm...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ServerCrash size={48} className="text-red-500" />
        <span className="font-medium text-red-600">{error || 'Không tìm thấy sản phẩm'}</span>
        <Button variant="outline" onClick={() => navigate('/products')}>Quay lại cửa hàng</Button>
      </div>
    );
  }

  // Derive unique options
  const availableVersions = product.variants ? [...new Set(product.variants.map(v => v.versionName))] : [];
  const availableColorsForVersion = product.variants 
    ? product.variants.filter(v => v.versionName === selectedVersion).map(v => v.colorName)
    : [];

  // Find exact matched variant
  const selectedVariant = product.variants?.find(
    v => v.versionName === selectedVersion && v.colorName === selectedColor
  );

  const currentPrice = selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = product.price;
  const stock = selectedVariant?.stock || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      await addToCart(selectedVariant.id, 1, {
        productName: product.name,
        productImage: mainImage || product.images?.[0] || 'https://via.placeholder.com/400',
        colorName: selectedColor,
        versionName: selectedVersion,
        price: currentPrice
      });

      showPopup({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng',
        message: `Bạn đã thêm ${product.name} (${selectedVersion} - ${selectedColor}) vào giỏ hàng thành công.`,
        confirmText: 'Đóng'
      });
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.',
        confirmText: 'Đóng'
      });
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;

    try {
      await addToCart(selectedVariant.id, 1, {
        productName: product.name,
        productImage: mainImage || product.images?.[0] || 'https://via.placeholder.com/400',
        colorName: selectedColor,
        versionName: selectedVersion,
        price: currentPrice
      });

      navigate('/checkout');
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi tiến hành Mua ngay. Vui lòng thử lại.',
        confirmText: 'Đóng'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ChevronLeft size={20} className="mr-1" />
        Quay lại Cửa hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images Gallery */}
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 rounded-3xl p-12 flex items-center justify-center border border-gray-100 relative group overflow-hidden h-[500px]">
            <img 
              src={mainImage || 'https://via.placeholder.com/400'} 
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 p-2 transition-all ${mainImage === img ? 'border-blue-600 bg-white' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                >
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`${product.name} thumbnail ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center space-x-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
            <span>{product.brandName || 'Thương hiệu'}</span>
            <span>•</span>
            <span>{product.categoryName || 'Điện thoại'}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {product.name}
          </h1>
          
          {/* Ratings */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star size={18} fill="currentColor" />
              <span className="ml-1.5 font-bold text-gray-900">{product.averageRating?.toFixed(1) || '5.0'}</span>
            </div>
            <span className="text-sm text-gray-500 font-medium">({product.reviewCount || 0} đánh giá)</span>
          </div>
          
          <div className="flex items-end space-x-4 mb-8">
            <span className="text-3xl font-extrabold text-blue-600">
              {formatPrice(currentPrice)}
            </span>
            {currentPrice < originalPrice && (
              <span className="text-xl text-gray-400 line-through font-semibold mb-1">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Variants Selection */}
          {availableVersions.length > 0 && (
            <div className="space-y-6 mb-8 border-y border-gray-100 py-6">
              
              {/* Version/Storage Selector */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Phiên bản</h4>
                <div className="flex flex-wrap gap-3">
                  {availableVersions.map(version => (
                    <button
                      key={version}
                      onClick={() => {
                        setSelectedVersion(version);
                        // Auto select first available color for this version
                        const firstColor = product.variants.find(v => v.versionName === version)?.colorName;
                        setSelectedColor(firstColor);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                        selectedVersion === version 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Màu sắc</h4>
                <div className="flex flex-wrap gap-3">
                  {availableColorsForVersion.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                        selectedColor === color 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex space-x-4">
            <Button 
              size="lg" 
              className="flex-1 flex items-center justify-center text-lg" 
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              <ShoppingCart size={22} className="mr-2" />
              {stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="flex-1 text-lg flex items-center justify-center"
              onClick={handleBuyNow}
              disabled={stock <= 0}
            >
              Mua ngay
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li className="flex justify-between">
                <span>Tình trạng:</span>
                <span className={stock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                  {stock > 0 ? `Còn hàng (${stock})` : 'Tạm hết hàng'}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Giao hàng:</span>
                <span className="text-gray-900">Miễn phí toàn quốc</span>
              </li>
              <li className="flex justify-between">
                <span>Bảo hành:</span>
                <span className="text-gray-900">12 tháng chính hãng</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  );
};

export default ProductDetail;
