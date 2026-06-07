import React, { useState, useEffect } from 'react';
import { getVariantsByProductId, createVariant, updateVariant, deleteVariant } from '../../services/productVariantService';
import { getProducts } from '../../services/productService';
import { getColors } from '../../services/colorService';
import { getVersions } from '../../services/versionService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search, PackageOpen } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const ProductVariantManagement = () => {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [versions, setVersions] = useState([]);
  const [variants, setVariants] = useState([]);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);

  const [formData, setFormData] = useState({
    id: null,
    productId: '',
    price: '',
    versionId: '',
    colorId: '',
    stock: 0
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchVariants(selectedProductId);
    } else {
      setVariants([]);
    }
  }, [selectedProductId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, colRes, verRes] = await Promise.all([
        getProducts(0, 100),
        getColors(),
        getVersions()
      ]);
      setProducts(prodRes.result?.content || prodRes.result || []);
      setColors(colRes.result?.content || colRes.result || []);
      setVersions(verRes.result?.content || verRes.result || []);
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải dữ liệu ban đầu.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchVariants = async (productId) => {
    try {
      setLoading(true);
      const res = await getVariantsByProductId(productId);
      setVariants(res.result || []);
    } catch (err) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách biến thể.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (variant = null) => {
    if (variant) {
      setFormData({
        id: variant.id,
        productId: variant.productId || selectedProductId,
        price: variant.price,
        versionId: variant.versionId || '',
        colorId: variant.colorId || '',
        stock: variant.stock
      });
    } else {
      setFormData({
        id: null,
        productId: selectedProductId,
        price: '',
        versionId: '',
        colorId: '',
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        productId: parseInt(formData.productId),
        price: parseFloat(formData.price),
        versionId: formData.versionId ? parseInt(formData.versionId) : null,
        colorId: formData.colorId ? parseInt(formData.colorId) : null,
        stock: parseInt(formData.stock)
      };

      if (formData.id) {
        await updateVariant(formData.id, payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Cập nhật biến thể thành công!' });
      } else {
        await createVariant(payload);
        showPopup({ type: 'success', title: 'Thành công', message: 'Thêm biến thể mới thành công!' });
      }
      if (selectedProductId) {
        fetchVariants(selectedProductId);
      }
      handleCloseModal();
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Thất bại',
        message: err.response?.data?.message || err.message || 'Đã xảy ra lỗi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    showPopup({
      type: 'confirm',
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa biến thể này không?',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteVariant(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa biến thể thành công.' });
          if (selectedProductId) fetchVariants(selectedProductId);
        } catch (err) {
          showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể xóa biến thể này.' });
        }
      }
    });
  };

  const filteredVariants = variants.filter(v => {
    const searchLower = searchTerm.toLowerCase();
    const colorName = v.colorName ? v.colorName.toLowerCase() : '';
    const versionName = v.versionName ? v.versionName.toLowerCase() : '';
    return colorName.includes(searchLower) || versionName.includes(searchLower);
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản lý Biến thể (Variants)</h1>
          <p className="text-sm text-gray-500 mt-1">
            {selectedProductId ? `Có ${variants.length} biến thể cho sản phẩm đang chọn.` : 'Vui lòng chọn một sản phẩm.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          <div className="w-full sm:w-64">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm biến thể (Màu, Phiên bản)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          <button 
            onClick={() => handleOpenModal()}
            disabled={!selectedProductId}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm ${
              !selectedProductId ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus size={16} />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 p-6">
        {!selectedProductId ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <PackageOpen size={48} className="mb-4 text-gray-300" />
            <p>Vui lòng chọn một sản phẩm từ danh sách trên để xem biến thể.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px] border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold w-16">ID</th>
                <th className="p-4 font-semibold">Phiên bản (Version)</th>
                <th className="p-4 font-semibold">Màu sắc (Color)</th>
                <th className="p-4 font-semibold text-right">Giá</th>
                <th className="p-4 font-semibold text-right">Tồn kho</th>
                <th className="p-4 font-semibold text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {showSkeleton ? (
                <TableSkeleton columns={6} rows={4} />
              ) : filteredVariants.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-500">Chưa có biến thể nào.</td></tr>
              ) : (
                filteredVariants.map((variant) => (
                  <tr key={variant.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-gray-600 font-mono text-sm">#{variant.id}</td>
                    <td className="p-4 font-medium text-gray-800">{variant.versionName || 'N/A'}</td>
                    <td className="p-4 font-medium text-gray-800">{variant.colorName || 'N/A'}</td>
                    <td className="p-4 text-right font-semibold text-red-600">{formatPrice(variant.price)}</td>
                    <td className="p-4 text-right font-medium text-gray-700">{variant.stock}</td>
                    <td className="p-4 flex justify-center space-x-1">
                      <button onClick={() => handleOpenModal(variant)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(variant.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-enter">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {formData.id ? 'Cập nhật Biến thể' : 'Thêm Biến thể mới'}
              </h3>
              <button onClick={handleCloseModal} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán *</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng (Tồn kho) *</label>
                <input 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phiên bản (Version)</label>
                <select 
                  value={formData.versionId} 
                  onChange={e => setFormData({...formData, versionId: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Không có --</option>
                  {versions.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc (Color)</label>
                <select 
                  value={formData.colorId} 
                  onChange={e => setFormData({...formData, colorId: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Không có --</option>
                  {colors.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 mt-2">
                <button type="button" onClick={handleCloseModal} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Hủy</button>
                <button type="submit" disabled={isSubmitting || !formData.price || formData.stock === ''} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantManagement;
