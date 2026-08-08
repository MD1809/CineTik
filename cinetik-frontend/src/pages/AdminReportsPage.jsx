import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { BarChart3, TrendingUp, Ticket, Popcorn, DollarSign, Calendar, Filter, Film } from 'lucide-react';

export default function AdminReportsPage() {
  const [revenueData, setRevenueData] = useState(null);
  const [movieSales, setMovieSales] = useState([]);
  const [fbSales, setFbSales] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [revRes, movieRes, fbRes] = await Promise.all([
        adminService.getRevenueReport(startDate, endDate),
        adminService.getMovieSalesReport(startDate, endDate),
        adminService.getFBSalesReport(startDate, endDate),
      ]);

      setRevenueData(revRes);
      setMovieSales(movieRes || []);
      setFbSales(fbRes || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Không thể tải báo cáo doanh thu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Báo Cáo Doanh Thu & Bán Vé</h1>
            <p className="text-xs text-slate-400 mt-0.5">Thống kê tổng quan doanh thu vé, doanh số theo phim và combo Bắp Nước F&B</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl text-xs">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
          />
          <span className="text-slate-500">đến</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Top 3 Stat Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">TỔNG DOANH THU</span>
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {revenueData?.tongDoanhThu ? revenueData.tongDoanhThu.toLocaleString('vi-VN') : 0} VNĐ
          </div>
          <p className="text-[11px] text-slate-500">Bao gồm doanh thu vé + F&B</p>
        </div>

        {/* Card 2: Tickets Sold */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">TỔNG VÉ ĐÃ BÁN</span>
            <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-xl">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-500">
            {revenueData?.tongSoVeBan || 0} Vé
          </div>
          <p className="text-[11px] text-slate-500">Số lượng ghế bán ra thành công</p>
        </div>

        {/* Card 3: F&B Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">DOANH THU BẮP NƯỚC F&B</span>
            <div className="p-2.5 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-xl">
              <Popcorn className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {revenueData?.doanhThuFB ? revenueData.doanhThuFB.toLocaleString('vi-VN') : 0} VNĐ
          </div>
          <p className="text-[11px] text-slate-500">Doanh số bán các Combo F&B</p>
        </div>

      </div>

      {/* Breakdown Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table 1: Revenue By Movie */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Film className="w-4 h-4 text-rose-500" />
            <span>Doanh Số Theo Bộ Phim</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Tên Bộ Phim</th>
                  <th className="p-3">Số Vé Bán</th>
                  <th className="p-3 text-right">Doanh Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {movieSales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">Chưa có dữ liệu bán vé.</td>
                  </tr>
                ) : (
                  movieSales.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white">{item.tenPhim}</td>
                      <td className="p-3 font-semibold text-slate-300">{item.soVeBan} Vé</td>
                      <td className="p-3 text-right font-extrabold text-rose-500">
                        {item.doanhThu ? item.doanhThu.toLocaleString('vi-VN') : 0} VNĐ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Sales By F&B Item */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Popcorn className="w-4 h-4 text-amber-500" />
            <span>Doanh Số Bắp Nước F&B</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Tên Combo F&B</th>
                  <th className="p-3">Số Lượng Bán</th>
                  <th className="p-3 text-right">Doanh Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fbSales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">Chưa có dữ liệu bán Bắp Nước.</td>
                  </tr>
                ) : (
                  fbSales.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white">{item.tenItem}</td>
                      <td className="p-3 font-semibold text-slate-300">x{item.soLuongBan}</td>
                      <td className="p-3 text-right font-extrabold text-amber-400">
                        {item.doanhThu ? item.doanhThu.toLocaleString('vi-VN') : 0} VNĐ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
