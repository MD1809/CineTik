import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { Popcorn, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminFBPage() {
  const [fbItems, setFbItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tenItem: '',
    giaTien: 50000,
    hinhAnh: '',
    moTa: '',
    trangThai: 'AVAILABLE',
  });

  useEffect(() => {
    fetchFBItems();
  }, []);

  const fetchFBItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllFBItems();
      setFbItems(data || []);
    } catch (err) {
      console.error('Error fetching F&B items:', err);
      setError('Không thể tải danh sách Bắp Nước F&B.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      tenItem: '',
      giaTien: 50000,
      hinhAnh: '',
      moTa: '',
      trangThai: 'AVAILABLE',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      tenItem: item.tenItem || '',
      giaTien: item.giaTien || 50000,
      hinhAnh: item.hinhAnh || '',
      moTa: item.moTa || '',
      trangThai: item.trangThai || 'AVAILABLE',
    });
    setModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm Bắp Nước này?')) return;
    try {
      await adminService.deleteFBItem(id);
      fetchFBItems();
    } catch (err) {
      console.error('Error deleting F&B item:', err);
      alert('Có lỗi xảy ra khi xóa sản phẩm F&B.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await adminService.updateFBItem(editingItem.id, formData);
      } else {
        await adminService.createFBItem(formData);
      }
      setModalOpen(false);
      fetchFBItems();
    } catch (err) {
      console.error('Error saving F&B item:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu món F&B.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-2xl">
            <Popcorn className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Quản Lý Combo Bắp Nước F&B</h1>
            <p className="text-xs text-slate-400 mt-0.5">Thêm, chỉnh sửa danh mục sản phẩm đồ ăn thức uống phục vụ rạp chiếu</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 transition flex items-center space-x-2 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Combo Mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* F&B Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Hình ảnh & Tên Combo</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fbItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {item.hinhAnh ? (
                          <img src={item.hinhAnh} alt={item.tenItem} className="w-full h-full object-cover" />
                        ) : (
                          <Popcorn className="w-6 h-6 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.tenItem}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{item.moTa || 'Combo chuẩn vị'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-amber-400 text-sm">
                    {item.giaTien ? item.giaTien.toLocaleString('vi-VN') : 0} VNĐ
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.trangThai === 'AVAILABLE'
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                          : 'bg-rose-950/80 border-rose-800 text-rose-400'
                      }`}
                    >
                      {item.trangThai === 'AVAILABLE' ? 'Còn Hàng' : 'Hết Hàng'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                      title="Sửa sản phẩm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-300 rounded-lg border border-slate-700 transition"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit F&B Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Sửa Sản Phẩm F&B' : 'Thêm Combo Bắp Nước Mới'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Tên Combo / Món *</label>
                <input
                  type="text"
                  value={formData.tenItem}
                  onChange={(e) => setFormData({ ...formData, tenItem: e.target.value })}
                  placeholder="VD: Combo Bắp Nước Đôi"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Giá Bán (VNĐ) *</label>
                  <input
                    type="number"
                    step="5000"
                    value={formData.giaTien}
                    onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Trạng Thái</label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="AVAILABLE">Còn Hàng</option>
                    <option value="OUT_OF_STOCK">Hết Hàng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">URL Hình Ảnh</label>
                <input
                  type="url"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  placeholder="Nhập chi tiết combo: 1 bắp lớn, 2 nước..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/60"
                >
                  {isSubmitting ? 'Đang lưu...' : editingItem ? 'Cập Nhật' : 'Tạo Combo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
