import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-slate-950 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
