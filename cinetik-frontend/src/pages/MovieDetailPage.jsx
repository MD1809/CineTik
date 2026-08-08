import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../api/movieService';
import TrailerModal from '../components/movie/TrailerModal';
import { Film, Star, Clock, Calendar, Globe, UserCheck, Play, Ticket, ArrowLeft, AlertCircle } from 'lucide-react';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [movieData, showtimesData] = await Promise.all([
        movieService.getMovieById(id),
        movieService.getShowtimesByMovie(id),
      ]);
      setMovie(movieData);
      setShowtimes(showtimesData || []);
    } catch (err) {
      console.error('Error fetching movie detail:', err);
      setError('Không thể tải thông tin bộ phim này.');
    } finally {
      setLoading(false);
    }
  };

  // Generate date tabs for next 5 days
  const getDateTabs = () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : `Thứ ${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`;
      const dayFormat = `${d.getDate()}/${d.getMonth() + 1}`;
      dates.push({ dateStr, dayName, dayFormat });
    }
    return dates;
  };

  const dateTabs = getDateTabs();

  // Filter showtimes for selected date
  const filteredShowtimes = showtimes.filter((s) => {
    if (!s.thoiGianBatDau) return false;
    return s.thoiGianBatDau.startsWith(selectedDate);
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy thông tin phim</h3>
        <p className="text-slate-400 text-sm mb-6">{error || 'Bộ phim không tồn tại hoặc đã bị xóa.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Danh sách Phim</span>
      </Link>

      {/* Movie Details Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10">
        {/* Backdrop Glow */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80'}
            alt={movie.tenPhim}
            className="w-full h-full object-cover blur-md"
          />
          <div className="absolute inset-0 bg-slate-950/80"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800">
            <img
              src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
              alt={movie.tenPhim}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-rose-600 text-white font-bold px-3 py-1 rounded-md text-xs">
                  {movie.doTuoi ? `C${movie.doTuoi}` : 'P'}
                </span>
                <span className="bg-slate-800 text-rose-400 font-semibold px-3 py-1 rounded-md text-xs border border-slate-700">
                  {movie.theLoai}
                </span>
                <span className="flex items-center space-x-1 text-amber-400 font-bold text-sm bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.danhGia || 9.5} / 10</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {movie.tenPhim}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Thời lượng: <strong>{movie.thoiLuong || 120} phút</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Khởi chiếu: <strong>{movie.ngayKhoiChieu || 'Đang chiếu'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Ngôn ngữ: <strong>{movie.ngonNgu || 'Tiếng Việt / Phụ đề'}</strong></span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 sm:col-span-3">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Đạo diễn & Diễn viên: <strong>{movie.daoDien || 'Đang cập nhật'} - {movie.dienVien || 'Đang cập nhật'}</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Nội dung tóm tắt</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {movie.moTa || 'Nội dung bộ phim hứa hẹn mang lại những khoảnh khắc điện ảnh khó quên cho khán giả.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerModalOpen(true)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-2"
                >
                  <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>Xem Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Picker Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <Ticket className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-bold text-white">Lịch Chiếu & Đặt Vé</h2>
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {dateTabs.map((tab) => {
            const active = selectedDate === tab.dateStr;
            return (
              <button
                key={tab.dateStr}
                onClick={() => setSelectedDate(tab.dateStr)}
                className={`px-5 py-3 rounded-2xl text-center shrink-0 border transition-all ${
                  active
                    ? 'bg-rose-600 border-rose-500 text-white font-bold shadow-lg shadow-rose-950/60 scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="text-xs uppercase font-medium">{tab.dayName}</div>
                <div className="text-sm font-bold mt-0.5">{tab.dayFormat}</div>
              </button>
            );
          })}
        </div>

        {/* Showtimes List */}
        {filteredShowtimes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">Chưa có suất chiếu nào vào ngày đã chọn.</p>
            <p className="text-slate-500 text-xs mt-1">Vui lòng chọn ngày khác để tiếp tục đặt vé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShowtimes.map((st) => {
              const startTime = st.thoiGianBatDau ? st.thoiGianBatDau.substring(11, 16) : '19:30';
              return (
                <div
                  key={st.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between transition shadow-md"
                >
                  <div className="space-y-1">
                    <div className="text-xs uppercase font-bold text-rose-400">
                      {st.cinemaRoom?.tenPhong || 'Phòng chiếu số 1'}
                    </div>
                    <div className="text-xl font-extrabold text-white flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <span>{startTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/booking/showtime/${st.id}`)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition hover:scale-105 flex items-center space-x-1"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Chọn suất chiếu</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {movie && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.tenPhim}
        />
      )}
    </div>
  );
}
