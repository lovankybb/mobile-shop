import React, { useState, useEffect } from 'react';
import { getVersions, createVersion, updateVersion, deleteVersion } from '../../services/versionService';
import { usePopup } from '../../contexts/PopupContext';
import TableSkeleton from '../../components/TableSkeleton';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const VersionManagement = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showSkeleton = useDelayedLoading(loading, 250);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });

  // Search and Select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const res = await getVersions();
      setVersions(res.result?.content || res.result || []);
      setSelectedIds([]);
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Lỗi Tải Dữ Liệu',
        message: 'Không thể tải danh sách phiên bản. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (version = null) => {
    if (version) {
      setFormData({ id: version.id, name: version.name });
    } else {
      setFormData({ id: null, name: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateVersion(formData.id, { name: formData.name });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật phiên bản thành công!' });
      } else {
        await createVersion({ name: formData.name });
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã thêm phiên bản mới thành công!' });
      }
      fetchVersions();
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
      message: 'Bạn có chắc chắn muốn xóa phiên bản này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa ngay',
      onConfirm: async () => {
        try {
          await deleteVersion(id);
          showPopup({ type: 'success', title: 'Đã xóa', message: 'Xóa phiên bản thành công.' });
          fetchVersions();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Lỗi xóa phiên bản. Có thể phiên bản này đang được sử dụng ở một sản phẩm.'
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
      message: `Bạn có chắc chắn muốn xóa ${selectedIds.length} phiên bản đã chọn? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa tất cả',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteVersion(id)));
          showPopup({ type: 'success', title: 'Đã xóa', message: `Xóa thành công ${selectedIds.length} phiên bản.` });
          fetchVersions();
        } catch (err) {
          showPopup({
            type: 'error',
            title: 'Lỗi xóa',
            message: 'Có lỗi xảy ra khi xóa một vài mục. Có thể chúng đang được sử dụng.'
          });
          fetchVersions();
        }
      }
    });
  };

  const filteredVersions = versions.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredVersions.map(v => v.id));
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
          <h1 className="text-xl font-bold text-gray-800">Quản lý Phiên bản</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {versions.length} phiên bản</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm phiên bản..."
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
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filteredVersions.length > 0 && selectedIds.length === filteredVersions.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold">Tên Phiên Bản</th>
              <th className="p-4 font-semibold text-right w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <TableSkeleton columns={4} rows={5} />
            ) : filteredVersions.length === 0 ? (
              <tr><td colSpan="4" className="p-12 text-center text-gray-500">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu.'}
              </td></tr>
            ) : (
              filteredVersions.map((version) => (
                <tr key={version.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(version.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(version.id)}
                      onChange={() => handleSelectOne(version.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">#{version.id}</td>
                  <td className="p-4 font-medium">{version.name}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenModal(version)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(version.id)}
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
                {formData.id ? 'Cập nhật Phiên bản' : 'Thêm Phiên bản mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Phiên bản</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: 8GB/256GB, 12GB/512GB..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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

export default VersionManagement;
