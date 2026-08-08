import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const result = await login(email, password);
      if (result.success && result.user) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          const role = result.user.role;
          if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
            navigate('/admin/movies', { replace: true });
          } else if (role === 'STAFF' || role === 'ROLE_STAFF') {
            navigate('/staff/checkin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } else {
        setError(result.message || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Brand & Title Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-950">
            <Film className="w-7 h-7 text-rose-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Đăng Nhập CineTik</h1>
          <p className="text-xs text-slate-400">Đăng nhập để xem lịch sử vé và trải nghiệm dịch vụ</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vd: khachhang@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-rose-950/60 flex items-center justify-center space-x-2 pt-3"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-rose-400 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
