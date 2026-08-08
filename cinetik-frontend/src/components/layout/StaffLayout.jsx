import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';

const StaffLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dedicated Staff Header Top Bar */}
      <StaffHeader mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Container: Left Dedicated Sidebar + Right Workspace */}
      <div className="flex flex-1 relative">
        <StaffSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
