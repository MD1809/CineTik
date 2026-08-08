import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { Film, Plus, Edit, Trash2, X, Star, Clock, AlertCircle, Play, Sparkles } from 'lucide-react';

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tenPhim: '',
    moTa: '',
    thoiLuong: 120,
    danhGia: 9.0,
    doTuoi: 13,
    theLoai: 'Hành động',
    posterUrl: '',
    trailerUrl: '',
    trangThai: 'DANG_CHIEU',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllMovies();
      setMovies(data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Không thể tải danh sách phim.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      tenPhim: '',
      moTa: '',
      thoiLuong: 120,
      danhGia: 9.0,
      doTuoi: 13,
      theLoai: 'Hành động',
      posterUrl: '',
      trailerUrl: '',
      trangThai: 'DANG_CHIEU',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      tenPhim: movie.tenPhim || '',
      moTa: movie.moTa || '',
      thoiLuong: movie.thoiLuong || 120,
      danhGia: movie.danhGia || 9.0,
      doTuoi: movie.doTuoi || 13,
      theLoai: movie.theLoai || 'Hành động',
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || '',
      trangThai: movie.trangThai || 'DANG_CHIEU',
    });
    setModalOpen(true);
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ phim này khỏi danh mục?')) return;
    try {
      await adminService.deleteMovie(id);
      fetchMovies();
    } catch (err) {
      console.error('Error deleting movie:', err);
      alert('Có lỗi xảy ra khi xóa phim.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingMovie) {
        await adminService.updateMovie(editingMovie.id, formData);
      } else {
        await adminService.createMovie(formData);
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error('Error saving movie:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin phim.');
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
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-2xl">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Quản Lý Danh Mục Phim</h1>
            <p className="text-xs text-slate-400 mt-0.5">Thêm, cập nhật danh sách phim chiếu rạp và thông tin trailer</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 transition flex items-center space-x-2 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phim Mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Movies Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Poster & Phim</th>
                <th className="p-4">Thể loại</th>
                <th className="p-4">Thời lượng</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-14 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shrink-0">
                        {movie.posterUrl ? (
                          <img src={movie.posterUrl} alt={movie.tenPhim} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Film className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{movie.tenPhim}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{movie.moTa}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-rose-400">{movie.theLoai}</td>
                  <td className="p-4">{movie.thoiLuong} Phút</td>
                  <td className="p-4 text-amber-400 font-bold">{movie.danhGia} / 10</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        movie.trangThai === 'DANG_CHIEU'
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                          : movie.trangThai === 'SAP_CHIEU'
                          ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {movie.trangThai === 'DANG_CHIEU'
                        ? 'Đang Chiếu'
                        : movie.trangThai === 'SAP_CHIEU'
                        ? 'Sắp Chiếu'
                        : 'Ngừng Chiếu'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(movie)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                      title="Sửa phim"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-300 rounded-lg border border-slate-700 transition"
                      title="Xóa phim"
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

      {/* Add / Edit Movie Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingMovie ? 'Cập Nhật Thông Tin Phim' : 'Thêm Bộ Phim Mới'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Tên Bộ Phim *</label>
                <input
                  type="text"
                  value={formData.tenPhim}
                  onChange={(e) => setFormData({ ...formData, tenPhim: e.target.value })}
                  placeholder="VD: Lật Mặt 7: Một Điều Ước"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Thể Loại</label>
                  <input
                    type="text"
                    value={formData.theLoai}
                    onChange={(e) => setFormData({ ...formData, theLoai: e.target.value })}
                    placeholder="Hành động, Viễn tưởng..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Trạng Thái Chiếu</label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="DANG_CHIEU">Đang Chiếu (DANG_CHIEU)</option>
                    <option value="SAP_CHIEU">Sắp Chiếu (SAP_CHIEU)</option>
                    <option value="NGUNG_CHIEU">Ngừng Chiếu (NGUNG_CHIEU)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    value={formData.thoiLuong}
                    onChange={(e) => setFormData({ ...formData, thoiLuong: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Đánh Giá (/10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.danhGia}
                    onChange={(e) => setFormData({ ...formData, danhGia: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Độ Tuổi (C13, C16...)</label>
                  <input
                    type="number"
                    value={formData.doTuoi}
                    onChange={(e) => setFormData({ ...formData, doTuoi: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">URL Ảnh Poster</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">URL Video Trailer (YouTube Embed)</label>
                <input
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mô Tả Bộ Phim</label>
                <textarea
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  placeholder="Nhập nội dung tóm tắt phim..."
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
                  {isSubmitting ? 'Đang lưu...' : editingMovie ? 'Cập Nhật' : 'Tạo Phim Mới'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
