import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Ticket, Coffee } from 'lucide-react';

const StaffSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/staff/checkin', label: 'Soát vé & Kiểm tra Bắp nước', icon: CheckSquare },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-16 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Staff Panel Header Box */}
          <div className="px-3.5 py-3 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/40 rounded-2xl shadow-inner">
            <div className="flex items-center space-x-2.5">
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Hệ thống Tác nghiệp</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Staff Control Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 translate-x-1'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          <p className="font-semibold text-slate-400">CineTik Staff v1.0</p>
          <p>© 2026 CineTik Movie System</p>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
