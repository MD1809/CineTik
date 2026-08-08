import React, { useState, useEffect } from 'react';
import { bookingService } from '../api/bookingService';
import { Ticket, Copy, Check, Calendar, Clock, MapPin, Popcorn, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
      setError('Không thể tải danh sách vé đã đặt.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-2xl">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Lịch Sử Đặt Vé Của Tôi</h1>
          <p className="text-xs text-slate-400 mt-0.5">Quản lý danh sách thẻ vé điện tử và trạng thái check-in tại rạp</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Bạn chưa có đơn đặt vé nào</h3>
          <p className="text-xs text-slate-400">Hãy chọn một bộ phim siêu hấp dẫn trên trang chủ để trải nghiệm điện ảnh ngay!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const isCheckedIn = ticket.trangThaiCheckin === 'CHECKED_IN';
            const isPaid = ticket.trangThaiThanhToan === 'PAID';

            return (
              <div
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-5 transition shadow-xl relative overflow-hidden"
              >
                {/* Top Ticket Header: Code & Check-in Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">MÃ VÉ DIỆN TỬ</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-extrabold text-rose-500 font-mono tracking-wider">{ticket.ticketCode}</span>
                      <button
                        onClick={() => handleCopyCode(ticket.ticketCode)}
                        className="p-1 text-slate-400 hover:text-white transition"
                        title="Sao chép mã vé"
                      >
                        {copiedCode === ticket.ticketCode ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Check-in Status Badge */}
                  <div
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      isCheckedIn
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                        : 'bg-amber-950/80 border-amber-700 text-amber-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCheckedIn ? 'ĐÃ SOÁT VÉ' : 'CHƯA SOÁT VÉ'}</span>
                  </div>
                </div>

                {/* Movie & Showtime Details */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="text-base font-bold text-white leading-tight">
                    {ticket.showtime?.movie?.tenPhim}
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Phòng: <strong>{ticket.showtime?.cinemaRoom?.tenPhong}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Suất chiếu: <strong>{ticket.showtime?.thoiGianBatDau}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 pt-1">
                    <Ticket className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Vị trí ghế: <strong className="text-white font-mono">{ticket.danhSachGhe?.join(', ')}</strong></span>
                  </div>

                  {/* F&B Items if any */}
                  {ticket.danhSachFB && ticket.danhSachFB.length > 0 && (
                    <div className="flex items-start space-x-2 text-amber-300 pt-1">
                      <Popcorn className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Bắp Nước: {ticket.danhSachFB.map((fb) => `${fb.tenItem} (x${fb.soLuong})`).join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Total Price Footer */}
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Tổng tiền thanh toán:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {ticket.tongTien ? ticket.tongTien.toLocaleString('vi-VN') : 0} VNĐ
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
