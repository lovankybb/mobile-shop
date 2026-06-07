import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { Search, Loader, ServerCrash, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const brandId = searchParams.get('brand');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, categoryId, brandId);
  }, [currentPage, categoryId, brandId]); // Refetch on page or filter change

  const fetchProducts = async (page = 0, keyword = '', catId = null, bId = null) => {
    try {
      setLoading(true);
      setError('');
      const res = await getProducts(page, pageSize, keyword, catId, bId);
      setProducts(res.result?.content || res.result || []);
      setTotalPages(res.result?.totalPages || 1);
    } catch (err) {
      setError('Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentPage !== 0) {
      setCurrentPage(0); // This will trigger useEffect to fetch
    } else {
      fetchProducts(0, searchTerm, categoryId, brandId);
    }
  };

  // Optimizing product filtering with useMemo as requested
  const activeProducts = useMemo(() => {
    return products.filter(p => p.status === 'ACTIVE' || !p.status);
  }, [products]);

  // Optimizing pagination array generation
  const pageNumbers = useMemo(() => {
    return [...Array(totalPages).keys()];
  }, [totalPages]);

  const showSkeleton = loading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Bộ sưu tập
          </h1>
          <p className="text-gray-500 font-medium">Tìm kiếm thiết bị hoàn hảo cho bạn.</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <input 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          <button 
            type="submit" 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Status Messages */}
      {showSkeleton && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(pageSize)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50 rounded-3xl border border-red-100">
          <ServerCrash size={48} className="text-red-500" />
          <span className="font-medium text-red-600">{error}</span>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && activeProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && activeProducts.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500">Hãy thử điều chỉnh tìm kiếm của bạn để tìm thấy thứ bạn muốn.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-16">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex space-x-1">
            {pageNumbers.map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
