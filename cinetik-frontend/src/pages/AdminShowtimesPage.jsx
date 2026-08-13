import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { Calendar, Plus, Edit, Clock, MapPin, Film, AlertCircle, DollarSign, X, CheckCircle2 } from 'lucide-react';

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedMovieFilter, setSelectedMovieFilter] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    thoiGianBatDau: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchShowtimes();
  }, [selectedMovieFilter, selectedDateFilter]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [moviesData, roomsData] = await Promise.all([
        adminService.getAllMovies(),
        adminService.getAllRooms(),
      ]);
      setMovies(moviesData || []);
      setRooms(roomsData || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Không thể tải danh sách phim và phòng chiếu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const data = await adminService.getAllShowtimes(selectedMovieFilter, selectedDateFilter);
      setShowtimes(data || []);
    } catch (err) {
      console.error('Error fetching showtimes:', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingShowtime(null);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultDateTime = now.toISOString().slice(0, 16);

    setFormData({
      movieId: movies.length > 0 ? movies[0].id : '',
      roomId: rooms.length > 0 ? rooms[0].id : '',
      thoiGianBatDau: defaultDateTime,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (showtime) => {
    setEditingShowtime(showtime);
    let dt = showtime.thoiGianBatDau || '';
    if (dt.length > 16) dt = dt.substring(0, 16);

    setFormData({
      movieId: showtime.movie?.id || '',
      roomId: showtime.cinemaRoom?.id || '',
      thoiGianBatDau: dt,
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.roomId || !formData.thoiGianBatDau) {
      alert('Vui lòng điền đầy đủ Phim, Phòng chiếu và Thời gian bắt đầu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const ngayChieu = formData.thoiGianBatDau.substring(0, 10);
      const payload = {
        movieId: Number(formData.movieId),
        roomId: Number(formData.roomId),
        ngayChieu: ngayChieu,
        thoiGianBatDau: formData.thoiGianBatDau,
      };

      if (editingShowtime) {
        await adminService.updateShowtime(editingShowtime.id, payload);
      } else {
        await adminService.createShowtime(payload);
      }

      setModalOpen(false);
      fetchShowtimes();
    } catch (err) {
      console.error('Error saving showtime:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu lịch chiếu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) return;
    try {
      await adminService.deleteShowtime(id);
      fetchShowtimes();
    } catch (err) {
      console.error('Error deleting showtime:', err);
      alert('Không thể xóa suất chiếu.');
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">
            <Calendar className="w-7 h-7 text-rose-500" />
            <span>Quản Lý Lịch Chiếu</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tạo suất chiếu mới và tự động áp dụng bảng giá, phụ thu & giảm giá động
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-950/60 transition hover:scale-[1.02] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Suất Chiếu Mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Film className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-slate-300">Lọc theo Phim:</span>
          <select
            value={selectedMovieFilter}
            onChange={(e) => setSelectedMovieFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
          >
            <option value="">Tất cả các phim</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.tenPhim}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-slate-300">Lọc theo ngày:</span>
          <input
            type="date"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Showtimes Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Tên Phim</th>
                <th className="p-4">Phòng Chiếu</th>
                <th className="p-4">Thời Gian Bắt Đầu</th>
                <th className="p-4">Phụ Thu Suất Chiếu</th>
                <th className="p-4">Giá Giảm Suất Chiếu</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {showtimes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Chưa có lịch chiếu nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                showtimes.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white text-sm">{st.movie?.tenPhim}</td>
                    <td className="p-4">
                      <div className="inline-flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{st.cinemaRoom?.tenPhong}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center space-x-1 text-slate-200 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{st.thoiGianBatDau}</span>
                      </div>
                    </td>
                    {/* Column: Surcharges (Money & Name) */}
                    <td className="p-4">
                      {st.appliedSurcharges && st.appliedSurcharges.length > 0 ? (
                        <div className="space-y-1">
                          {st.appliedSurcharges.map((item, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-800/60 text-amber-400 text-xs font-bold"
                            >
                              <span>{item.formattedDisplay}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Không có</span>
                      )}
                    </td>
                    {/* Column: Discounts (Money/% & Name) */}
                    <td className="p-4">
                      {st.appliedDiscounts && st.appliedDiscounts.length > 0 ? (
                        <div className="space-y-1">
                          {st.appliedDiscounts.map((item, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-bold"
                            >
                              <span>{item.formattedDisplay}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Không có</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
                        title="Sửa lịch chiếu"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Showtime Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingShowtime ? 'Sửa Suất Chiếu' : 'Tạo Suất Chiếu Mới'}
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
                <label className="font-semibold text-slate-300">Chọn Bộ Phim *</label>
                <select
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.tenPhim} ({m.thoiLuong} Phút)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Chọn Phòng Chiếu *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.tenPhong} ({r.soLuongGhe || 50} Ghế)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Thời Gian Bắt Đầu *</label>
                <input
                  type="datetime-local"
                  value={formData.thoiGianBatDau}
                  onChange={(e) => setFormData({ ...formData, thoiGianBatDau: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-rose-400">💡 Tự Động Áp Dụng Bảng Giá & Phụ Thu:</div>
                <div>Giá vé, phụ thu giờ cao điểm và giảm giá khuyến mãi sẽ được hệ thống tính tự động dựa trên khung giờ & loại ngày mà bạn đã cấu hình tại trang Quản lý Bảng Giá.</div>
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
                  {isSubmitting ? 'Đang lưu...' : editingShowtime ? 'Cập Nhật' : 'Tạo Suất Chiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
