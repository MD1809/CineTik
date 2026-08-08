import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { Users, UserPlus, Lock, Unlock, Key, X, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Staff Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    matKhau: '123456',
    soDienThoai: '',
  });

  // Reset Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newPassword, setNewPassword] = useState('123456');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllStaff();
      setStaffList(data || []);
    } catch (err) {
      console.error('Error fetching staff list:', err);
      setError('Không thể tải danh sách tài khoản nhân viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!formData.hoTen || !formData.email || !formData.matKhau) return;

    try {
      setIsSubmitting(true);
      await adminService.createStaff(formData);
      setAddModalOpen(false);
      setFormData({ hoTen: '', email: '', matKhau: '123456', soDienThoai: '' });
      fetchStaffList();
    } catch (err) {
      console.error('Error creating staff:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản nhân viên.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (staff) => {
    const newStatus = staff.trangThaiAcc === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const actionText = newStatus === 'LOCKED' ? 'Khóa' : 'Mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) return;

    try {
      await adminService.updateStaffStatus(staff.id, newStatus);
      fetchStaffList();
    } catch (err) {
      console.error('Error updating staff status:', err);
      alert('Có lỗi xảy ra khi đổi trạng thái tài khoản.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !newPassword) return;

    try {
      setIsSubmitting(true);
      await adminService.resetStaffPassword(selectedStaff.id, newPassword);
      alert(`Đã reset mật khẩu thành công cho nhân viên ${selectedStaff.hoTen}!`);
      setResetModalOpen(false);
    } catch (err) {
      console.error('Error resetting password:', err);
      alert('Có lỗi xảy ra khi reset mật khẩu.');
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
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Quản Lý Tài Khoản Nhân Viên</h1>
            <p className="text-xs text-slate-400 mt-0.5">Tạo tài khoản Staff, cấp quyền soát vé, khóa tài khoản hoặc cấp lại mật khẩu</p>
          </div>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 transition flex items-center space-x-2 shrink-0 hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tạo Nhân Viên Mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Staff Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Họ và Tên Staff</th>
                <th className="p-4">Địa chỉ Email</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white text-sm">{staff.hoTen}</td>
                  <td className="p-4 font-mono text-slate-300">{staff.email}</td>
                  <td className="p-4">{staff.soDienThoai || 'N/A'}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        staff.trangThaiAcc === 'ACTIVE'
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                          : 'bg-rose-950/80 border-rose-800 text-rose-400'
                      }`}
                    >
                      {staff.trangThaiAcc === 'ACTIVE' ? 'Hoạt Động' : 'Đã Khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(staff)}
                      className={`p-1.5 rounded-lg border transition ${
                        staff.trangThaiAcc === 'ACTIVE'
                          ? 'bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border-slate-700'
                          : 'bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-400 border-slate-700'
                      }`}
                      title={staff.trangThaiAcc === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    >
                      {staff.trangThaiAcc === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setResetModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-amber-950/80 hover:text-amber-400 text-slate-300 rounded-lg border border-slate-700 transition"
                      title="Reset Mật khẩu"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Tạo Tài Khoản Nhân Viên Mới</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Họ và Tên Staff *</label>
                <input
                  type="text"
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  placeholder="VD: Nguyễn Văn Soát Vé"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Địa chỉ Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@cinetik.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Số Điện Thoại</label>
                <input
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  placeholder="VD: 0987654321"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mật Khẩu Ban Đầu *</label>
                <input
                  type="password"
                  value={formData.matKhau}
                  onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/60"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Reset Mật Khẩu Staff</h3>
              <button
                onClick={() => setResetModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <p className="text-slate-300 text-sm">
                Cấp lại mật khẩu mới cho nhân viên: <strong className="text-rose-400">{selectedStaff.hoTen}</strong>
              </p>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mật Khẩu Mới *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-amber-950/60"
                >
                  {isSubmitting ? 'Đang reset...' : 'Xác Nhận Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
