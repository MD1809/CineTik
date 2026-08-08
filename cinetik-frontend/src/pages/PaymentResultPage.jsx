import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { CheckCircle2, XCircle, Copy, Check, Ticket, Mail, Home, Clock, MapPin, Popcorn } from 'lucide-react';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const ticketCode = searchParams.get('ticketCode') || '';
  const status = searchParams.get('status') || 'success';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const isSuccess = status === 'success';

  useEffect(() => {
    if (ticketCode) {
      fetchBookingDetail();
    } else {
      setLoading(false);
    }
  }, [ticketCode]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/bookings/${ticketCode}`);
      setBooking(response.data.data);
    } catch (err) {
      console.error('Error fetching booking detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicketCode = () => {
    if (ticketCode) {
      navigator.clipboard.writeText(ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="max-w-2xl mx-auto my-8 space-y-8 p-4">
      {isSuccess ? (
        /* SUCCESS RESULT CARD */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          
          {/* Header Icon */}
          <div className="w-20 h-20 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-950">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">ĐẶT VÉ THÀNH CÔNG!</h1>
            <p className="text-sm text-slate-400">Cảm ơn bạn đã lựa chọn trải nghiệm điện ảnh tại CineTik Cinema</p>
          </div>

          {/* Prominent 10-Character Ticket Code Box */}
          <div className="bg-slate-950 border-2 dashed border-rose-600/80 rounded-2xl p-6 space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">MÃ VÉ CỦA BẠN (CHECK-IN TẠI RẠP)</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-500 font-mono tracking-widest">
              {ticketCode}
            </div>

            <button
              onClick={handleCopyTicketCode}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Sao chép mã vé</span>
                </>
              )}
            </button>
          </div>

          {/* Booking Summary Details */}
          {booking && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 text-sm">
              <div className="text-base font-bold text-white border-b border-slate-800 pb-2">
                {booking.showtime?.movie?.tenPhim}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>Phòng chiếu: <strong>{booking.showtime?.cinemaRoom?.tenPhong}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Suất chiếu: <strong>{booking.showtime?.thoiGianBatDau}</strong></span>
                </div>
                <div className="flex items-center space-x-2 col-span-1 sm:col-span-2">
                  <Ticket className="w-4 h-4 text-slate-500" />
                  <span>Vị trí ghế: <strong className="text-rose-400">{booking.danhSachGhe?.join(', ')}</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Tổng tiền đã thanh toán:</span>
                <span className="font-extrabold text-emerald-400 text-base">
                  {booking.tongTien ? booking.tongTien.toLocaleString('vi-VN') : 0} VNĐ
                </span>
              </div>
            </div>
          )}

          {/* Email Notification Alert */}
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-4 flex items-center space-x-3 text-xs text-blue-300 text-left">
            <Mail className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Mã vé đã được gửi tự động tới Email của bạn. Vui lòng xuất trình mã vé cho Nhân viên soát vé tại rạp.</span>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/my-tickets"
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg transition text-center"
            >
              Xem danh sách vé của tôi
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition text-center"
            >
              Quay lại Trang chủ
            </Link>
          </div>

        </div>
      ) : (
        /* FAILED RESULT CARD */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">THANH TOÁN THẤT BẠI HOẶC BỊ HỦY</h1>
            <p className="text-sm text-slate-400">Giao dịch thanh toán chưa hoàn tất. Ghế tạm giữ của bạn đã được giải phóng.</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl shadow-lg transition text-center"
            >
              Quay lại Trang chủ để Đặt lại vé
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
