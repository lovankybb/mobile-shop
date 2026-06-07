import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  // Search and Select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.result?.content || res.result || []);
      setSelectedIds([]);
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi Tải Dữ Liệu',
        message: 'Không thể tải danh mục. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setFormData({ id: category.id, name: category.name, description: category.description || '' });
    } else {
      setFormData({ id: null, name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateCategory(formData.id, { name: formData.name, description: formData.description });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật danh mục thành công!' });
      } else {
        await createCategory({ name: formData.name, description: formData.description });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã thêm danh mục mới thành công!' });
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Thất bại',
        message: err.response?.data?.message || 'Đã xảy ra lỗi khi lưu thông tin.'
      });
    }
  };

  const handleDelete = (id) => {
    showPopup({
      type: 'confirm',
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa danh mục thành công.' });
          fetchCategories();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Lỗi xóa danh mục. Có thể danh mục này đang chứa sản phẩm.'
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
      message: `Bạn có chắc chắn muốn xóa ${selectedIds.length} danh mục đã chọn? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa tất cả',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteCategory(id)));
          showPopup({ type: 'success', title: 'Đã xóa', message: `Xóa thành công ${selectedIds.length} danh mục.` });
          fetchCategories();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Có lỗi xảy ra khi xóa. Một vài danh mục có thể đang được sử dụng.'
          });
          fetchCategories();
        }
      }
    });
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCategories.map(c => c.id));
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
          <h1 className="text-xl font-bold text-gray-800">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {categories.length} danh mục</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm danh mục..."
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
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filteredCategories.length > 0 && selectedIds.length === filteredCategories.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold w-64">Tên Danh mục</th>
              <th className="p-4 font-semibold">Mô tả</th>
              <th className="p-4 font-semibold text-right w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <TableSkeleton columns={5} rows={5} />
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-gray-500">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu.'}
              </td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(category.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(category.id)}
                      onChange={() => handleSelectOne(category.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">#{category.id}</td>
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 text-gray-600">{category.description || <span className="italic text-gray-400">Không có mô tả</span>}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop-enter">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-enter">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {formData.id ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Danh mục</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="VD: Điện thoại, Laptop..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="Nhập mô tả danh mục (không bắt buộc)..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
