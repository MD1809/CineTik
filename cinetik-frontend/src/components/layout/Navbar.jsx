import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Film, User, LogOut, Ticket, ShieldAlert, CheckSquare, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl tracking-wider text-rose-500 hover:text-rose-400 transition-colors">
            <Film className="w-8 h-8 text-rose-500" />
            <span>CINETIK</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-rose-400 transition-colors">
              Trang chủ
            </Link>
            <Link to="/movies" className="text-sm font-medium hover:text-rose-400 transition-colors">
              Danh sách Phim
            </Link>
            <Link to="/showtimes" className="text-sm font-medium hover:text-rose-400 transition-colors">
              Lịch chiếu
            </Link>

            {user && (
              <Link to="/my-tickets" className="text-sm font-medium hover:text-rose-400 transition-colors flex items-center space-x-1">
                <Ticket className="w-4 h-4 text-rose-400" />
                <span>Vé của tôi</span>
              </Link>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1 bg-amber-950/50 border border-amber-800/60 px-3 py-1.5 rounded-lg">
                <ShieldAlert className="w-4 h-4" />
                <span>Quản trị Admin</span>
              </Link>
            )}

            {user?.role === 'ROLE_STAFF' && (
              <Link to="/staff/checkin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
                <CheckSquare className="w-4 h-4" />
                <span>Soát vé Check-in</span>
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-full transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.hoTen}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm font-semibold text-white truncate">{user.hoTen}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/my-tickets"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Lịch sử đặt vé</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-rose-400 hover:bg-slate-700 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Trang chủ
          </Link>
          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Danh sách Phim
          </Link>
          <Link
            to="/showtimes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Lịch chiếu
          </Link>

          {user ? (
            <>
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-slate-800"
              >
                Vé của tôi
              </Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-800"
                >
                  Quản trị Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-rose-500 hover:bg-slate-800"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
