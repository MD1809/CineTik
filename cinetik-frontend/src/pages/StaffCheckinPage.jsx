import React, { useState } from 'react';
import { staffService } from '../api/staffService';
import { QrCode, Search, CheckCircle2, XCircle, Popcorn, Ticket, MapPin, Clock, AlertTriangle, ShieldCheck, User } from 'lucide-react';

export default function StaffCheckinPage() {
  const [ticketCodeInput, setTicketCodeInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!ticketCodeInput.trim()) {
      setError('Vui lòng nhập mã vé 10 ký tự.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setResult(null);

      const data = await staffService.checkinTicket(ticketCodeInput.trim().toUpperCase());
      setResult(data);
      setTicketCodeInput('');
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thực hiện check-in vé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      {/* Header Banner */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Cổng Soát Vé & Bàn Giao F&B</h1>
          <p className="text-xs text-slate-400 mt-0.5">Dành cho Nhân viên Rạp (STAFF) soát vé 10 ký tự và chuẩn bị Bắp Nước</p>
        </div>
      </div>

      {/* Ticket Check-in Search Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">NHẬP MÃ VÉ ĐIỆN TỬ (10 KÝ TỰ)</h2>
        
        <form onSubmit={handleCheckin} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Ticket className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={ticketCodeInput}
              onChange={(e) => setTicketCodeInput(e.target.value.toUpperCase())}
              placeholder="VD: CNK8920153"
              maxLength={12}
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-lg font-mono font-bold text-rose-500 uppercase focus:outline-none focus:border-rose-500 transition placeholder:text-slate-600 tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 shrink-0"
          >
            <Search className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang kiểm tra...' : 'Kiểm Tra & Check-in'}</span>
          </button>
        </form>
      </div>

      {/* ERROR ALERT CARD */}
      {error && (
        <div className="bg-rose-950/80 border-2 border-rose-600/80 rounded-3xl p-6 space-y-3 text-rose-200 shadow-2xl animate-in fade-in">
          <div className="flex items-center space-x-3 text-rose-400 font-bold text-base border-b border-rose-800/80 pb-3">
            <XCircle className="w-6 h-6 shrink-0" />
            <span>CHECK-IN KHÔNG THÀNH CÔNG!</span>
          </div>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* SUCCESS RESULT CARD WITH BR-07 F&B HANDOVER */}
      {result && (
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
          
          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-emerald-400 uppercase">VÉ HỢP LỆ - SOÁT VÉ THÀNH CÔNG</h3>
                <p className="text-xs text-slate-400">Thời gian: {result.thoiGianCheckin || new Date().toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className="text-right font-mono font-extrabold text-2xl text-rose-500">{result.ticketCode}</div>
          </div>

          {/* Ticket Information Breakdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-sm">
            <div className="text-base font-bold text-white border-b border-slate-800 pb-2">
              {result.showtime?.movie?.tenPhim || 'Thông tin phim'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Phòng chiếu: <strong>{result.showtime?.cinemaRoom?.tenPhong}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Suất chiếu: <strong>{result.showtime?.thoiGianBatDau}</strong></span>
              </div>
              <div className="flex items-center space-x-2 col-span-1 sm:col-span-2">
                <Ticket className="w-4 h-4 text-slate-500" />
                <span>Vị trí ghế: <strong className="text-rose-400 text-sm">{result.danhSachGhe?.join(', ')}</strong></span>
              </div>
            </div>
          </div>

          {/* BR-07 F&B HANDOVER LIST (CRITICAL STAFF REQUIREMENT) */}
          <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm border-b border-amber-800/60 pb-2">
              <Popcorn className="w-5 h-5 text-amber-400" />
              <span className="uppercase">DANH SÁCH BẮP NƯỚC CẦN BÀN GIAO CHO KHÁCH (BR-07)</span>
            </div>

            {result.danhSachFB && result.danhSachFB.length > 0 ? (
              <div className="space-y-2">
                {result.danhSachFB.map((fb, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-amber-950/60 p-3 rounded-xl border border-amber-800/40 text-sm">
                    <span className="font-bold text-amber-200">{fb.tenItem}</span>
                    <span className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs">
                      SL: x{fb.soLuong}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-amber-300/70 italic">Đơn đặt vé này không kèm Combo Bắp Nước F&B nào.</div>
            )}
          </div>

          {/* Staff Footer Audit */}
          <div className="text-xs text-slate-500 text-right flex items-center justify-end space-x-1">
            <User className="w-3.5 h-3.5" />
            <span>Thực hiện bởi Nhân viên soát vé</span>
          </div>

        </div>
      )}
    </div>
  );
}
