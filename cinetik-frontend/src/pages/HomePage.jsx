import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../api/movieService';
import TrailerModal from '../components/movie/TrailerModal';
import { Film, Play, Star, Clock, Ticket, Sparkles, Filter, ChevronRight, AlertCircle } from 'lucide-react';

const genres = ['Tất cả', 'Hành động', 'Viễn tưởng', 'Hoạt hình', 'Kinh dị', 'Hài', 'Tình cảm', 'Phiêu lưu'];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('NOW_SHOWING'); // NOW_SHOWING or COMING_SOON
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');

  // Trailer modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [activeTab, selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getMovies(activeTab, selectedGenre);
      setMovies(data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Không thể tải danh sách phim. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTrailer = (movie) => {
    setSelectedTrailerMovie(movie);
    setTrailerModalOpen(true);
  };

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      {featuredMovie && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl min-h-[420px] flex items-center">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80'}
              alt={featuredMovie.tenPhim}
              className="w-full h-full object-cover object-center opacity-30 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-rose-950/80 border border-rose-800/60 text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>PHIM NỔI BẬT HÔM NAY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {featuredMovie.tenPhim}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded text-xs">
                {featuredMovie.doTuoi ? `C${featuredMovie.doTuoi}` : 'P'}
              </span>
              <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{featuredMovie.danhGia || 9.5} / 10</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{featuredMovie.thoiLuong || 120} Phút</span>
              </span>
              <span className="text-rose-400 font-medium">{featuredMovie.theLoai}</span>
            </div>

            <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
              {featuredMovie.moTa || 'Bộ phim chiếu rạp siêu hấp dẫn đang làm mưa làm gió tại hệ thống phòng chiếu CineTik.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={`/movies/${featuredMovie.id}`}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-950/60 transition flex items-center space-x-2 hover:scale-105"
              >
                <Ticket className="w-5 h-5" />
                <span>Đặt vé ngay</span>
              </Link>
              
              {featuredMovie.trailerUrl && (
                <button
                  onClick={() => handleOpenTrailer(featuredMovie)}
                  className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition flex items-center space-x-2"
                >
                  <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>Xem Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Header & Filter */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* Status Tabs */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('NOW_SHOWING')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'NOW_SHOWING'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phim Đang Chiếu
            </button>
            <button
              onClick={() => setActiveTab('COMING_SOON')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'COMING_SOON'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phim Sắp Chiếu
            </button>
          </div>

          {/* Genre Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 hidden md:block" />
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedGenre === genre
                    ? 'bg-slate-800 text-rose-400 border border-rose-800/60 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl h-96 animate-pulse p-4 flex flex-col justify-end">
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <p className="text-slate-300 text-sm">{error}</p>
            <button
              onClick={fetchMovies}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg"
            >
              Thử lại
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">Không tìm thấy phim phù hợp</h3>
            <p className="text-slate-500 text-sm mt-1">Vui lòng thay đổi thể loại hoặc chuyển tab phim khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                  <img
                    src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
                    alt={movie.tenPhim}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.danhGia || 9.0}</span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {movie.thoiLuong ? `${movie.thoiLuong}p` : '120p'}
                  </div>

                  {/* Play Trailer Button overlay */}
                  {movie.trailerUrl && (
                    <button
                      onClick={() => handleOpenTrailer(movie)}
                      className="absolute inset-0 m-auto w-14 h-14 bg-rose-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl shadow-rose-950"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-rose-400 font-semibold mb-1">
                      <span>{movie.theLoai}</span>
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                      {movie.tenPhim}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                    <Link
                      to={`/movies/${movie.id}`}
                      className="flex-1 text-center py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
                    >
                      Đặt vé ngay
                    </Link>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                      title="Chi tiết"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {selectedTrailerMovie && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          trailerUrl={selectedTrailerMovie.trailerUrl}
          movieTitle={selectedTrailerMovie.tenPhim}
        />
      )}
    </div>
  );
}
