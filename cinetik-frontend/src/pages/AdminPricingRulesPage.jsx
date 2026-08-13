import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles
} from 'lucide-react';

export default function AdminPricingRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // ALL, SURCHARGE, DISCOUNT

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tenQuyTac: '',
    loaiDieuChinh: 'SURCHARGE',
    hinhThuc: 'FIXED_AMOUNT',
    giaTri: 15000,
    loaiNgay: 'ALL',
    ngayCuThe: '',
    gioBatDau: '18:00',
    gioKetThuc: '22:00',
    trangThai: true,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllPricingRules();
      setRules(data || []);
    } catch (err) {
      console.error('Error fetching pricing rules:', err);
      setError('Không thể tải danh sách quy tắc bảng giá.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setFormData({
      tenQuyTac: '',
      loaiDieuChinh: 'SURCHARGE',
      hinhThuc: 'FIXED_AMOUNT',
      giaTri: 15000,
      loaiNgay: 'ALL',
      ngayCuThe: '',
      gioBatDau: '',
      gioKetThuc: '',
      trangThai: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      tenQuyTac: rule.tenQuyTac || '',
      loaiDieuChinh: rule.loaiDieuChinh || 'SURCHARGE',
      hinhThuc: rule.hinhThuc || 'FIXED_AMOUNT',
      giaTri: rule.giaTri || 0,
      loaiNgay: rule.loaiNgay || 'ALL',
      ngayCuThe: rule.ngayCuThe || '',
      gioBatDau: rule.gioBatDau || '',
      gioKetThuc: rule.gioKetThuc || '',
      trangThai: rule.trangThai !== undefined ? rule.trangThai : true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteRule = async (id, ten) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa quy tắc giá "${ten}"?`)) return;

    try {
      await adminService.deletePricingRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert(err.response?.data?.message || 'Không thể xóa quy tắc giá.');
    }
  };

  const handleToggleStatus = async (rule) => {
    try {
      const updatedPayload = {
        ...rule,
        trangThai: !rule.trangThai,
      };
      await adminService.updatePricingRule(rule.id, updatedPayload);
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, trangThai: !rule.trangThai } : r))
      );
    } catch (err) {
      console.error('Error toggling rule status:', err);
      alert('Không thể thay đổi trạng thái quy tắc.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.tenQuyTac.trim()) {
      alert('Vui lòng nhập tên quy tắc!');
      return;
    }

    if (formData.loaiNgay === 'SPECIFIC_DATE' && !formData.ngayCuThe) {
      alert('Vui lòng chọn Ngày cụ thể!');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        tenQuyTac: formData.tenQuyTac.trim(),
        loaiDieuChinh: formData.loaiDieuChinh,
        hinhThuc: formData.hinhThuc,
        giaTri: Number(formData.giaTri),
        loaiNgay: formData.loaiNgay,
        ngayCuThe: formData.loaiNgay === 'SPECIFIC_DATE' ? formData.ngayCuThe : null,
        gioBatDau: formData.gioBatDau || null,
        gioKetThuc: formData.gioKetThuc || null,
        trangThai: formData.trangThai,
      };

      if (editingRule) {
        const updated = await adminService.updatePricingRule(editingRule.id, payload);
        setRules((prev) => prev.map((r) => (r.id === editingRule.id ? updated : r)));
      } else {
        const created = await adminService.createPricingRule(payload);
        setRules((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving pricing rule:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu quy tắc giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRules = rules.filter((r) => {
    if (filterType === 'SURCHARGE') return r.loaiDieuChinh === 'SURCHARGE';
    if (filterType === 'DISCOUNT') return r.loaiDieuChinh === 'DISCOUNT';
    return true;
  });

  const getDayTypeLabel = (rule) => {
    switch (rule.loaiNgay) {
      case 'WEEKDAY':
        return 'Ngày thường (T2 - T6)';
      case 'WEEKEND':
        return 'Cuối tuần (T7, CN)';
      case 'MONDAY':
        return 'Thứ 2 hàng tuần';
      case 'TUESDAY':
        return 'Thứ 3 hàng tuần';
      case 'WEDNESDAY':
        return 'Thứ 4 hàng tuần';
      case 'THURSDAY':
        return 'Thứ 5 hàng tuần';
      case 'FRIDAY':
        return 'Thứ 6 hàng tuần';
      case 'SATURDAY':
        return 'Thứ 7 hàng tuần';
      case 'SUNDAY':
        return 'Chủ Nhật hàng tuần';
      case 'SPECIFIC_DATE':
        return `Ngày cụ thể: ${rule.ngayCuThe || 'N/A'}`;
      default:
        return 'Tất cả các ngày';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-rose-950/80 border border-rose-800/60 text-rose-400 font-bold px-3 py-1 rounded-full text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DYNAMIC PRICING ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">
            <Tag className="w-7 h-7 text-rose-500" />
            <span>Quản Lý Bảng Giá, Phụ Thu & Giảm Giá</span>
          </h1>
          <p className="text-xs text-slate-400">
            Tùy chỉnh linh hoạt quy tắc phụ thu giờ cao điểm, giảm giá khuyến mãi theo khung giờ và loại ngày
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-950/60 transition hover:scale-[1.02] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Quy Tắc Mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterType === 'ALL'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả ({rules.length})
        </button>
        <button
          onClick={() => setFilterType('SURCHARGE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            filterType === 'SURCHARGE'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Phụ Thu ({rules.filter((r) => r.loaiDieuChinh === 'SURCHARGE').length})</span>
        </button>
        <button
          onClick={() => setFilterType('DISCOUNT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            filterType === 'DISCOUNT'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Giảm Giá ({rules.filter((r) => r.loaiDieuChinh === 'DISCOUNT').length})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">Đang tải quy tắc bảng giá...</div>
      ) : error ? (
        <div className="p-6 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-2xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="py-16 bg-slate-900/50 border border-slate-800 rounded-3xl text-center space-y-3">
          <Tag className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Chưa có quy tắc giá nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map((rule) => {
            const isSurcharge = rule.loaiDieuChinh === 'SURCHARGE';
            const isPercentage = rule.hinhThuc === 'PERCENTAGE';

            return (
              <div
                key={rule.id}
                className={`bg-slate-900 border rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl transition-all hover:border-slate-700 ${
                  rule.trangThai ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        isSurcharge
                          ? 'bg-amber-950/80 border border-amber-800/80 text-amber-400'
                          : 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400'
                      }`}
                    >
                      {isSurcharge ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{isSurcharge ? 'Phụ thu' : 'Giảm giá'}</span>
                    </span>

                    {/* Status Toggle Switch */}
                    <button
                      onClick={() => handleToggleStatus(rule)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                        rule.trangThai
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {rule.trangThai ? 'Đang bật' : 'Đã tắt'}
                    </button>
                  </div>

                  {/* Rule Name */}
                  <h3 className="text-base font-bold text-white leading-snug">{rule.tenQuyTac}</h3>

                  {/* Value Highlight Box */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Mức điều chỉnh:</span>
                    <span
                      className={`text-xl font-extrabold font-mono ${
                        isSurcharge ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {isSurcharge ? '+' : '-'}
                      {isPercentage
                        ? `${rule.giaTri}%`
                        : `${Number(rule.giaTri).toLocaleString('vi-VN')} VNĐ`}
                    </span>
                  </div>

                  {/* Conditions Details */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Loại ngày: <strong className="text-white">{getDayTypeLabel(rule)}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        Khung giờ:{' '}
                        <strong className="text-rose-400">
                          {rule.gioBatDau && rule.gioKetThuc
                            ? `${rule.gioBatDau} - ${rule.gioKetThuc}`
                            : 'Áp dụng cả ngày'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(rule)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id, rule.tenQuyTac)}
                    className="p-2 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 rounded-xl transition cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Rule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Tag className="w-6 h-6 text-rose-500" />
                <span>{editingRule ? 'Chỉnh Sửa Quy Tắc Giá' : 'Thêm Quy Tắc Giá Mới'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs sm:text-sm">
              {/* Rule Name */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Tên quy tắc (*)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phụ thu Giờ Cao Điểm Tối, Giảm giá Suất Sáng..."
                  value={formData.tenQuyTac}
                  onChange={(e) => setFormData({ ...formData, tenQuyTac: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Adjustment Type & Format Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Loại điều chỉnh</label>
                  <select
                    value={formData.loaiDieuChinh}
                    onChange={(e) => setFormData({ ...formData, loaiDieuChinh: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="SURCHARGE">Phụ Thu (+)</option>
                    <option value="DISCOUNT">Giảm Giá (-)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Hình thức tính</label>
                  <select
                    value={formData.hinhThuc}
                    onChange={(e) => setFormData({ ...formData, hinhThuc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                  </select>
                </div>
              </div>

              {/* Value Input */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">
                  Giá trị điều chỉnh {formData.hinhThuc === 'PERCENTAGE' ? '(%)' : '(VNĐ)'} (*)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder={formData.hinhThuc === 'PERCENTAGE' ? '10' : '15000'}
                  value={formData.giaTri}
                  onChange={(e) => setFormData({ ...formData, giaTri: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 font-mono font-bold"
                />
              </div>

              {/* Day Type Selection */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Loại ngày áp dụng</label>
                <select
                  value={formData.loaiNgay}
                  onChange={(e) => setFormData({ ...formData, loaiNgay: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="ALL">Tất cả các ngày trong tuần</option>
                  <option value="WEEKDAY">Ngày thường (Thứ 2 đến Thứ 6)</option>
                  <option value="WEEKEND">Cuối tuần (Thứ 7 & Chủ Nhật)</option>
                  <option value="MONDAY">Chỉ áp dụng Thứ 2 hàng tuần</option>
                  <option value="TUESDAY">Chỉ áp dụng Thứ 3 hàng tuần</option>
                  <option value="WEDNESDAY">Chỉ áp dụng Thứ 4 hàng tuần</option>
                  <option value="THURSDAY">Chỉ áp dụng Thứ 5 hàng tuần</option>
                  <option value="FRIDAY">Chỉ áp dụng Thứ 6 hàng tuần</option>
                  <option value="SATURDAY">Chỉ áp dụng Thứ 7 hàng tuần</option>
                  <option value="SUNDAY">Chỉ áp dụng Chủ Nhật hàng tuần</option>
                  <option value="SPECIFIC_DATE">Ngày cụ thể (Chọn ngày từ lịch)</option>
                </select>
              </div>

              {/* Specific Date Picker (If SPECIFIC_DATE selected) */}
              {formData.loaiNgay === 'SPECIFIC_DATE' && (
                <div className="space-y-1">
                  <label className="block font-semibold text-rose-400">Chọn Ngày Cụ Thể Áp Dụng (*)</label>
                  <input
                    type="date"
                    required
                    value={formData.ngayCuThe}
                    onChange={(e) => setFormData({ ...formData, ngayCuThe: e.target.value })}
                    className="w-full bg-slate-950 border border-rose-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 font-bold cursor-pointer"
                  />
                </div>
              )}

              {/* Time Window Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Giờ bắt đầu (tùy chọn)</label>
                  <input
                    type="time"
                    value={formData.gioBatDau}
                    onChange={(e) => setFormData({ ...formData, gioBatDau: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Giờ kết thúc (tùy chọn)</label>
                  <input
                    type="time"
                    value={formData.gioKetThuc}
                    onChange={(e) => setFormData({ ...formData, gioKetThuc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Status Checkbox */}
              <label className="flex items-center space-x-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 bg-slate-950 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Kích hoạt quy tắc ngay sau khi lưu
                </span>
              </label>

              {/* Modal Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-center cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition text-center cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Quy Tắc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
