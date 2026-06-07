import React, { useState, useEffect, useRef } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../../services/brandService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', description: '', logo: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Search and Select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await getBrands();
      setBrands(res.result?.content || res.result || []);
      setSelectedIds([]);
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi Tải Dữ Liệu',
        message: 'Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setFormData({ 
        id: brand.id, 
        name: brand.name, 
        description: brand.description || '',
        logo: brand.logo || ''
      });
      setImagePreview(brand.logo || '');
    } else {
      setFormData({ id: null, name: '', description: '', logo: '' });
      setImagePreview('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: '', description: '', logo: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        showPopup({ type: 'error', title: 'File quá lớn', message: 'Vui lòng chọn ảnh dưới 2MB.' });
        return;
      }
      setImageFile(file);
      // Tạo URL preview cho ảnh vừa chọn
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let logoUrl = formData.logo;

      // Nếu có file mới, upload lên Cloudinary trước
      if (imageFile) {
        logoUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        logo: logoUrl
      };

      if (formData.id) {
        await updateBrand(formData.id, payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật thương hiệu thành công!' });
      } else {
        await createBrand(payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã thêm thương hiệu mới thành công!' });
      }
      fetchBrands();
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

  const handleDelete = (id) => {
    showPopup({
      type: 'confirm',
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa thương hiệu này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteBrand(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa thương hiệu thành công.' });
          fetchBrands();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Không thể xóa thương hiệu. Có thể thương hiệu này đang chứa sản phẩm.'
          });
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    showPopup({
      type: 'confirm',
      title: 'Xóa nhiều mục',
      message: `Bạn có chắc chắn muốn xóa ${selectedIds.length} thương hiệu đã chọn? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa tất cả',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteBrand(id)));
          showPopup({ type: 'success', title: 'Đã xóa', message: `Xóa thành công ${selectedIds.length} thương hiệu.` });
          fetchBrands();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Có lỗi xảy ra khi xóa. Một vài thương hiệu có thể đang được sử dụng.'
          });
          fetchBrands();
        }
      }
    });
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredBrands.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản lý Thương hiệu</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {brands.length} thương hiệu</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm thương hiệu..."
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
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filteredBrands.length > 0 && selectedIds.length === filteredBrands.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold w-24 text-center">Logo</th>
              <th className="p-4 font-semibold w-48">Tên Thương hiệu</th>
              <th className="p-4 font-semibold">Mô tả</th>
              <th className="p-4 font-semibold text-right w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <TableSkeleton columns={6} rows={5} />
            ) : filteredBrands.length === 0 ? (
              <tr><td colSpan="6" className="p-12 text-center text-gray-500">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu.'}
              </td></tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr key={brand.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(brand.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(brand.id)}
                      onChange={() => handleSelectOne(brand.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">#{brand.id}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {brand.logo ? (
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="w-10 h-10 object-contain rounded-md bg-white border border-gray-200 p-1"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=No+Img'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{brand.name}</td>
                  <td className="p-4 text-gray-600">{brand.description || <span className="italic text-gray-400">Không có mô tả</span>}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenModal(brand)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(brand.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Cập nhật/Thêm mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop-enter overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-enter my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {formData.id ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu mới'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Logo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Thương hiệu</label>
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div 
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative group cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs font-medium">Tải ảnh lên</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay for replacing image */}
                    {imagePreview && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">Khuyến nghị ảnh vuông, tối đa 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Thương hiệu</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="VD: Apple, Samsung..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="Nhập mô tả thương hiệu (không bắt buộc)..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isUploading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || (!formData.name.trim())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    'Lưu Thông Tin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
