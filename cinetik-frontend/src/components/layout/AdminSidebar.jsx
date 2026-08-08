import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Calendar, DoorOpen, Coffee, Users, BarChart3, LayoutDashboard } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Tổng quan Admin', icon: LayoutDashboard, exact: true },
    { path: '/admin/movies', label: 'Quản lý Phim', icon: Film },
    { path: '/admin/showtimes', label: 'Quản lý Suất chiếu', icon: Calendar },
    { path: '/admin/rooms', label: 'Quản lý Phòng chiếu', icon: DoorOpen },
    { path: '/admin/fb-items', label: 'Quản lý F&B Bắp Nước', icon: Coffee },
    { path: '/admin/staff', label: 'Quản lý Nhân viên', icon: Users },
    { path: '/admin/reports', label: 'Báo cáo Doanh thu', icon: BarChart3 },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6 px-3 py-2 bg-amber-950/40 border border-amber-800/40 rounded-xl">
        <p className="text-xs uppercase font-bold text-amber-400 tracking-wider">Hệ thống Quản trị</p>
        <p className="text-sm font-semibold text-slate-200 mt-0.5">Admin Control Panel</p>
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-rose-600 text-white font-semibold shadow-lg shadow-rose-950/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
