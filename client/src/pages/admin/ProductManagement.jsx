import React, { useState, useEffect, useRef } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetailById, updateProductStatus } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getBrands } from '../../services/brandService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search, Upload, ImageIcon, Eye, Package } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    id: null, name: '', price: '', salePrice: '', description: '', 
    status: 'ACTIVE', categoryId: '', brandId: '', slug: '', images: [], featured: false 
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Search and Select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        getProducts(0, 100), // Lấy 100 sản phẩm tạm thời (nên có pagination server sau này)
        getCategories(),
        getBrands()
      ]);
      setProducts(prodRes.result?.content || prodRes.result || []);
      setCategories(catRes.result?.content || catRes.result || []);
      setBrands(brandRes.result?.content || brandRes.result || []);
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts(0, 100);
      setProducts(res.result?.content || res.result || []);
      setSelectedIds([]);
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách sản phẩm.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({ 
        id: product.id, 
        name: product.name, 
        price: product.price,
        salePrice: product.salePrice,
        description: product.description || '',
        status: product.status || 'ACTIVE',
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        slug: product.slug || '',
        images: product.images || (product.image ? [product.image] : []),
        featured: product.featured || false
      });
      setImagePreviews(product.images || (product.image ? [product.image] : []));
    } else {
      setFormData({ 
        id: null, name: '', price: '', salePrice: '', description: '', 
        status: 'ACTIVE', categoryId: '', brandId: '', slug: '', images: [], featured: false 
      });
      setImagePreviews([]);
    }
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleOpenDetailModal = async (product) => {
    try {
      setLoading(true);
      const res = await getProductDetailById(product.id);
      setSelectedProductDetail(res.result);
      setIsDetailModalOpen(true);
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải chi tiết sản phẩm.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate size
    for(let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        showPopup({ type: 'error', title: 'File quá lớn', message: 'Mỗi ảnh phải dưới 2MB.' });
        return;
      }
    }
    
    setImageFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    // If it's an existing image url (string)
    if (typeof imagePreviews[indexToRemove] === 'string' && !imagePreviews[indexToRemove].startsWith('blob:')) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove)
      }));
    } else {
      // It's a newly selected file (blob)
      // Find how many previous images are existing URLs to calculate correct file index
      const existingUrlsCount = formData.images.length;
      const fileIndex = indexToRemove - existingUrlsCount;
      if (fileIndex >= 0) {
        setImageFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
      }
    }
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      
      let finalImages = [...formData.images];
      
      // Upload new files
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : parseFloat(formData.price),
        description: formData.description,
        status: formData.status,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        images: finalImages,
        featured: formData.featured || false
      };

      if (formData.id) {
        await updateProduct(formData.id, payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật sản phẩm thành công!' });
      } else {
        await createProduct(payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã thêm sản phẩm mới thành công!' });
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Thất bại',
        message: err.message || err.response?.data?.message || 'Đã xảy ra lỗi khi lưu thông tin.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateProductStatus(id, newStatus);
      showPopup({ type: 'success', title: 'Thành công', message: 'Cập nhật trạng thái thành công.' });
      fetchProducts();
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật trạng thái.' });
      fetchProducts(); // reset to original status
    }
  };

  const handleDelete = (id) => {
    showPopup({
      type: 'confirm',
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa sản phẩm thành công.' });
          fetchProducts();
        } catch (err) {
          showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể xóa sản phẩm này.' });
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    showPopup({
      type: 'confirm',
      title: 'Xóa nhiều mục',
      message: `Xóa ${selectedIds.length} sản phẩm đã chọn?`,
      confirmText: 'Xóa tất cả',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteProduct(id)));
          showPopup({ type: 'success', title: 'Đã xóa', message: `Đã xóa ${selectedIds.length} sản phẩm.` });
          fetchProducts();
        } catch (err) {
          showPopup({ type: 'error', title: 'Lỗi', message: 'Có lỗi xảy ra khi xóa.' });
          fetchProducts();
        }
      }
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {products.length} sản phẩm</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Trash2 size={16} />
              <span>Xóa ({selectedIds.length})</span>
            </button>
          )}

          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  onChange={(e) => e.target.checked ? setSelectedIds(filteredProducts.map(p => p.id)) : setSelectedIds([])}
                />
              </th>
              <th className="p-4 font-semibold w-16">ID</th>
              <th className="p-4 font-semibold w-20 text-center">Ảnh</th>
              <th className="p-4 font-semibold">Tên Sản phẩm</th>
              <th className="p-4 font-semibold">Thương hiệu / DM</th>
              <th className="p-4 font-semibold text-right">Giá bán</th>
              <th className="p-4 font-semibold text-center w-24">Trạng thái</th>
              <th className="p-4 font-semibold text-right w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <TableSkeleton columns={8} rows={5} />
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="8" className="p-12 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(product.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id])}
                    />
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">#{product.id}</td>
                  <td className="p-4">
                    <div 
                      className="flex justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleOpenDetailModal(product)}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md bg-white border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleOpenDetailModal(product)}
                      className="font-medium text-blue-600 hover:underline text-left line-clamp-2"
                    >
                      {product.name}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">{product.brandName || 'N/A'}</span>
                      <br/>
                      <span className="text-gray-500 text-xs">{product.categoryName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-red-600">{formatPrice(product.salePrice)}</div>
                    {product.salePrice < product.price && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      value={product.status} 
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer focus:outline-none appearance-none border-0 text-center ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        product.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600' : 
                        product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="ACTIVE" className="bg-white text-gray-800">Hoạt động (ACTIVE)</option>
                      <option value="DRAFT" className="bg-white text-gray-800">Bản nháp (DRAFT)</option>
                      <option value="ARCHIVED" className="bg-white text-gray-800">Lưu trữ (ARCHIVED)</option>
                    </select>
                  </td>
                  <td className="p-4 flex justify-end space-x-1">
                    <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Sản Phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop-enter overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-modal-enter my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 text-lg">
                {formData.id ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}
              </h3>
              <button onClick={handleCloseModal} disabled={isUploading} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cột 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản phẩm *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc *</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                      <input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Chọn --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                      <select value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Chọn --</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                      <option value="DRAFT">Bản nháp (DRAFT)</option>
                      <option value="ARCHIVED">Lưu trữ (ARCHIVED)</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={formData.featured} 
                      onChange={e => setFormData({...formData, featured: e.target.checked})} 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                      Hiển thị trên Banner (Sản phẩm nổi bật)
                    </label>
                  </div>
                </div>

                {/* Cột 2 */}
                <div className="space-y-4 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none min-h-[120px]" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
                      <span>Hình ảnh Sản phẩm</span>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-blue-600 text-xs flex items-center hover:underline">
                        <Plus size={14} className="mr-1" /> Thêm ảnh
                      </button>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-lg border border-gray-200 aspect-square overflow-hidden bg-gray-50">
                          <img src={preview} alt={`preview ${index}`} className="w-full h-full object-contain" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border-2 border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 cursor-pointer bg-gray-50 transition-colors"
                      >
                        <Upload size={20} className="mb-1" />
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />
                  </div>
                </div>

              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} disabled={isUploading} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Hủy</button>
                <button type="submit" disabled={isUploading || !formData.name} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center">
                  {isUploading ? 'Đang xử lý...' : 'Lưu Sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Sản Phẩm */}
      {isDetailModalOpen && selectedProductDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-enter">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center">
                <Package className="mr-2 text-blue-600" size={20} /> Chi tiết Sản phẩm
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200 p-2 overflow-hidden flex items-center justify-center">
                    {selectedProductDetail.images && selectedProductDetail.images.length > 0 ? (
                       <img src={selectedProductDetail.images[0]} className="w-full h-full object-contain" alt="product" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={48} />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedProductDetail.images && selectedProductDetail.images.slice(1,4).map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"><img src={img} className="w-full h-full object-contain" /></div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProductDetail.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">ID: #{selectedProductDetail.id} | Phân loại: {selectedProductDetail.category?.name || 'N/A'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(selectedProductDetail.salePrice)}</span>
                    {selectedProductDetail.salePrice < selectedProductDetail.price && (
                      <span className="text-gray-400 line-through">{formatPrice(selectedProductDetail.price)}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-500 block mb-1">Thương hiệu</span>
                      <span className="font-semibold text-gray-800">{selectedProductDetail.brand?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Trạng thái</span>
                      <span className="font-semibold text-green-600">{selectedProductDetail.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Đánh giá</span>
                      <span className="font-semibold text-amber-500">⭐ {selectedProductDetail.averageRating} ({selectedProductDetail.reviewCount} lượt)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Các phiên bản:</h4>
                    {selectedProductDetail.variants && selectedProductDetail.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedProductDetail.variants.map((v) => (
                           <span key={v.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                             {v.versionName} - {v.colorName} ({formatPrice(v.price)})
                           </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Chưa có phiên bản (Variants) nào.</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                 <h4 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm:</h4>
                 <div className="text-sm text-gray-600 whitespace-pre-wrap">{selectedProductDetail.description || 'Chưa có mô tả.'}</div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
               <button onClick={() => setIsDetailModalOpen(false)} className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium">Đóng</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
