import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Đang tải dữ liệu CineTik...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-rose-950/60 border border-rose-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 font-bold text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-sm text-slate-400 mb-6">
            Tài khoản của bạn không có đủ thẩm quyền để truy cập trang này.
          </p>
          <a
            href="/"
            className="inline-block bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-950/50"
          >
            Quay lại Trang chủ
          </a>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
