import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getBrands } from '../services/brandService';
import './HomePage.css';

export default function Home() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerProduct, setBannerProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandRes, productRes, bannerRes] = await Promise.all([
          getBrands(),
          getProducts(0, 8),
          getProducts(0, 1, '', null, null, true)
        ]);
        setBrands(brandRes.result?.content || brandRes.result || []);
        const rawProducts = productRes.result?.content || productRes.result || [];
        setFeaturedProducts(rawProducts.filter(p => p.status === 'ACTIVE' || !p.status));
        
        const rawBanner = bannerRes.result?.content || bannerRes.result || [];
        if (rawBanner.length > 0) {
          setBannerProduct(rawBanner[0]);
        }
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onNavigate = (path) => {
    navigate(path);
  };

  const fmt = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="hp-root">
      <div className="hp-container">
        
        {/* ══ HERO BANNER ══ */}
        <div className="hp-hero">
          <div className="hp-hero-content">
            <h1 className="hp-hero-title">{bannerProduct ? bannerProduct.name : 'AURA S24 ULTRA'}</h1>
            <p className="hp-hero-sub">{bannerProduct && bannerProduct.description ? bannerProduct.description : 'Đỉnh cao công nghệ trong tầm tay.'}</p>
            <p className="hp-hero-status">Đặt hàng ngay.</p>
            <button className="hp-hero-btn" onClick={() => onNavigate(bannerProduct ? `/products/${bannerProduct.id}` : '/products')}>
              MUA NGAY
            </button>
          </div>
          <div className="hp-hero-image-wrap">
             {bannerProduct && bannerProduct.image ? (
               <img className="hp-hero-image" src={bannerProduct.image} alt={bannerProduct.name} />
             ) : (
               <div className="hp-hero-image" style={{width: 200, height: 350, background: '#d1d5db', borderRadius: 24}}></div>
             )}
          </div>
        </div>

        {/* ══ EXPLORE BRANDS ══ */}
        <h2 className="hp-section-header">Khám phá Thương hiệu</h2>
        <div className="hp-brands-row">
          {brands.map((brand) => (
            <div key={brand.id} className="hp-brand-item" onClick={() => onNavigate(`/products?brand=${brand.id}`)}>
              <div className="hp-brand-circle">
                {brand.logo ? (
                   <img className="hp-brand-image" src={brand.logo} alt={brand.name} />
                ) : (
                   <span style={{fontWeight: 700, color: '#9ca3af'}}>{brand.name}</span>
                )}
              </div>
              <span className="hp-brand-name">{brand.name}</span>
            </div>
          ))}
        </div>

        {/* ══ FEATURED PRODUCTS ══ */}
        <h2 className="hp-section-header">Sản phẩm Nổi bật</h2>
        <div className="hp-prod-grid">
          {featuredProducts.map((phone) => (
            <div key={phone.id} className="hp-prod-card" onClick={() => onNavigate(`/products/${phone.id}`)}>
              <div className="hp-prod-thumb">
                <img className="hp-prod-image" src={phone.image || 'https://via.placeholder.com/150'} alt={phone.name} />
              </div>
              <div className="hp-prod-info">
                <h3 className="hp-prod-name">{phone.name}</h3>
                <p className="hp-prod-specs">
                  {phone.categoryName || 'Điện thoại'} | 256GB
                </p>
                <div className="hp-prod-price">{fmt(phone.salePrice)}</div>
                <button className="hp-prod-btn">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
