import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, LogOut, Menu, X, User } from 'lucide-react';

const StaffHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg">
      
      {/* Left: Mobile Toggle & Staff Brand Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-emerald-950/80 border border-emerald-700/80 rounded-xl flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/40">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wide flex items-center space-x-2">
              <span>CINETIK STAFF</span>
              <span className="text-[10px] uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
                Cổng Soát Vé Rạp
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Hệ thống tác nghiệp soát vé và bàn giao F&B</p>
          </div>
        </div>
      </div>

      {/* Right: Staff Profile & Logout Button */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user.hoTen ? user.hoTen.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
            </div>
            <div className="hidden md:block text-left text-xs pr-1">
              <p className="font-bold text-white truncate max-w-[130px]">{user.hoTen}</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase">{user.role || 'STAFF'}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 bg-rose-950/60 hover:bg-rose-600 border border-rose-800/80 text-rose-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md"
          title="Đăng xuất khỏi Staff"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>

    </header>
  );
};

export default StaffHeader;
