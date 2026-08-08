import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Ticket } from 'lucide-react';

const StaffSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6 px-3 py-2 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
        <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Hệ thống Tác nghiệp</p>
        <p className="text-sm font-semibold text-slate-200 mt-0.5">Staff Control Panel</p>
      </div>

      <nav className="space-y-1.5">
        <Link
          to="/staff/checkin"
          className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            location.pathname.startsWith('/staff/checkin')
              ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-950/50'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Soát vé Check-in</span>
        </Link>
      </nav>
    </aside>
  );
};

export default StaffSidebar;
