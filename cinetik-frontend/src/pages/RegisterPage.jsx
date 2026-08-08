import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hoTen || !email || !matKhau || !soDienThoai) {
      setError('Vui lòng điền đầy đủ các trường thông tin.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await authService.register(hoTen, email, matKhau, soDienThoai);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
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
            <UserPlus className="w-7 h-7 text-rose-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Tạo Tài Khoản Mới</h1>
          <p className="text-xs text-slate-400">Đăng ký thành viên để nhận ưu đãi và tích điểm vé xem phim</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Đăng ký tài khoản thành công! Đang chuyển hướng sang Đăng nhập...</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Họ và Tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="vd: Nguyễn Văn A"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-slate-300">Số Điện Thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="vd: 0987654321"
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
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-rose-950/60 flex items-center justify-center space-x-2 pt-3"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-rose-400 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
