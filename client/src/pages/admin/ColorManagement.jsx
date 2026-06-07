import React, { useState, useEffect } from 'react';
import { getColors, createColor, updateColor, deleteColor } from '../../services/colorService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const ColorManagement = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', hex: '#000000' });
  
  // Search and Select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setLoading(true);
      const res = await getColors();
      setColors(res.result?.content || res.result || []);
      setSelectedIds([]); // Reset selection on fetch
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi Tải Dữ Liệu',
        message: 'Không thể tải danh sách màu sắc. Vui lòng kiểm tra kết nối mạng.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (color = null) => {
    if (color) {
      setFormData({ id: color.id, name: color.name, hex: color.hex || '#000000' });
    } else {
      setFormData({ id: null, name: '', hex: '#000000' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: '', hex: '#000000' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateColor(formData.id, { name: formData.name, hex: formData.hex });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật màu sắc thành công!' });
      } else {
        await createColor({ name: formData.name, hex: formData.hex });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã thêm màu sắc mới thành công!' });
      }
      fetchColors();
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
      message: 'Bạn có chắc chắn muốn xóa màu này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteColor(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa màu sắc thành công.' });
          fetchColors();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Không thể xóa màu này vì nó có thể đang được sử dụng ở một sản phẩm.'
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
      message: `Bạn có chắc chắn muốn xóa ${selectedIds.length} màu đã chọn? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa tất cả',
      onConfirm: async () => {
        try {
          // Lặp qua và xóa từng mục (vì backend chưa có API xóa nhiều)
          await Promise.all(selectedIds.map(id => deleteColor(id)));
          showPopup({ type: 'success', title: 'Đã xóa', message: `Xóa thành công ${selectedIds.length} màu.` });
          fetchColors();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Có lỗi xảy ra khi xóa một vài mục. Có thể chúng đang được sử dụng.'
          });
          fetchColors();
        }
      }
    });
  };

  const filteredColors = colors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.hex && c.hex.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredColors.map(c => c.id));
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
          <h1 className="text-xl font-bold text-gray-800">Quản lý Màu sắc</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {colors.length} màu</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm màu sắc..."
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
                  checked={filteredColors.length > 0 && selectedIds.length === filteredColors.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold w-24 text-center">Hiển thị</th>
              <th className="p-4 font-semibold">Tên Màu</th>
              <th className="p-4 font-semibold text-gray-500 font-mono text-xs w-32">Mã HEX</th>
              <th className="p-4 font-semibold text-right w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <TableSkeleton columns={6} rows={5} />
            ) : filteredColors.length === 0 ? (
              <tr><td colSpan="6" className="p-12 text-center text-gray-500">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu.'}
              </td></tr>
            ) : (
              filteredColors.map((color) => (
                <tr key={color.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(color.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(color.id)}
                      onChange={() => handleSelectOne(color.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">#{color.id}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <div 
                        className="w-8 h-8 rounded-full shadow-sm border border-gray-300"
                        style={{ backgroundColor: color.hex || '#000000' }}
                        title={color.name}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{color.name}</td>
                  <td className="p-4 text-gray-500 font-mono text-sm">{color.hex}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenModal(color)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(color.id)}
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
                {formData.id ? 'Cập nhật Màu sắc' : 'Thêm Màu mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Preview Area */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div 
                  className="w-16 h-16 rounded-full shadow-inner border border-gray-300 flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: formData.hex }}
                ></div>
                <div>
                  <div className="font-medium text-gray-800">{formData.name || 'Tên màu...'}</div>
                  <div className="text-gray-500 font-mono text-sm mt-1">{formData.hex}</div>
                </div>
              </div>

              {/* Input: Tên màu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Màu</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="VD: Đen nhám, Trắng tuyết..."
                  required
                />
              </div>

              {/* Input: Mã HEX */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã màu (HEX)</label>
                <div className="flex space-x-3">
                  <input 
                    type="color" 
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="h-10 w-16 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                    placeholder="#000000"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Mã màu HEX (VD: #FFFFFF)"
                    required
                  />
                </div>
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

export default ColorManagement;
