import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fbService } from '../api/fbService';
import { bookingService } from '../api/bookingService';
import { vnpayService } from '../api/vnpayService';
import FBSelector from '../components/booking/FBSelector';
import { ArrowLeft, Ticket, Popcorn, ShieldAlert, CheckSquare, CreditCard, Clock, MapPin, AlertTriangle } from 'lucide-react';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { showtime, selectedSeats = [], totalSeatPrice = 0 } = location.state || {};

  const [fbItems, setFbItems] = useState([]);
  const [fbQuantities, setFbQuantities] = useState({});
  const [loadingFB, setLoadingFB] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showtime || selectedSeats.length === 0) {
      // Redirect back if user directly accesses /booking/checkout without state
      navigate('/');
      return;
    }

    fetchFBItems();
  }, [showtime, selectedSeats]);

  const fetchFBItems = async () => {
    try {
      setLoadingFB(true);
      const items = await fbService.getPublicFBItems();
      setFbItems(items || []);
    } catch (err) {
      console.error('Error fetching F&B items:', err);
    } finally {
      setLoadingFB(false);
    }
  };

  const handleFBQuantityChange = (item, newQty) => {
    setFbQuantities((prev) => ({
      ...prev,
      [item.id]: newQty,
    }));
  };

  const calculateFBTotal = () => {
    let total = 0;
    fbItems.forEach((item) => {
      const qty = fbQuantities[item.id] || 0;
      total += (item.giaTien || 0) * qty;
    });
    return total;
  };

  const totalFBPrice = calculateFBTotal();
  const grandTotal = totalSeatPrice + totalFBPrice;

  const handlePayment = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập tài khoản để hoàn tất thanh toán!');
      navigate('/login');
      return;
    }

    if (!agreedToTerms) {
      alert('Vui lòng đọc và xác nhận đồng ý với Quy định Không Hủy/Đổi Vé!');
      return;
    }

    try {
      setIsSubmitting(true);

      // Build F&B payload
      const selectedFBPayload = Object.entries(fbQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({
          fbItemId: Number(id),
          soLuong: qty,
        }));

      // 1. Create Booking (Returns Booking PENDING with ticketCode)
      const bookingData = {
        showtimeId: showtime.id,
        seatIds: selectedSeats.map((s) => s.id),
        fbItems: selectedFBPayload,
      };

      const bookingRes = await bookingService.createBooking(bookingData);
      const ticketCode = bookingRes.ticketCode;

      // 2. Create VNPay Payment URL
      const paymentRes = await vnpayService.createPaymentUrl(ticketCode);
      const paymentUrl = paymentRes.paymentUrl;

      // 3. Redirect user to VNPay Payment / Mock Sandbox Gateway
      window.location.href = paymentUrl;
    } catch (err) {
      console.error('Error initiating payment:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng thanh toán.');
      setIsSubmitting(false);
    }
  };

  if (!showtime) return null;

  const selectedSeatLabels = selectedSeats.map((s) => `${s.hang}${s.cot}`).join(', ');

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Chọn ghế</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: F&B Selector & Rules (Cols 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* F&B Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <Popcorn className="w-6 h-6 text-amber-500" />
              <div>
                <h2 className="text-xl font-bold text-white">Chọn Combo Bắp Nước F&B (Tùy chọn)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Nhận trực tiếp đồ ăn thức uống tại quầy khi check-in soát vé</p>
              </div>
            </div>

            {loadingFB ? (
              <div className="py-8 text-center text-slate-500 text-sm">Đang tải danh sách Bắp Nước...</div>
            ) : (
              <FBSelector
                fbItems={fbItems}
                quantities={fbQuantities}
                onQuantityChange={handleFBQuantityChange}
              />
            )}
          </div>

          {/* BR-04 No Cancellation Policy Notice */}
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-3xl p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                  Quy Định Đặt Vé & Thanh Toán (BR-04)
                </h4>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Vui lòng kiểm tra kỹ thông tin Suất chiếu, Phòng chiếu và Số ghế trước khi thực hiện thanh toán.
                  Vé sau khi đã thanh toán thành công <strong>KHÔNG ĐƯỢC HỦY, ĐỔI HOẶC HOÀN TIỀN</strong> dưới bất kỳ hình thức nào.
                </p>
              </div>
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-center space-x-3 pt-2 border-t border-amber-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-amber-700 text-rose-600 focus:ring-rose-500 bg-slate-950 cursor-pointer"
              />
              <span className="text-xs font-semibold text-white">
                Tôi đã đọc, hiểu và hoàn toàn đồng ý với Quy định Không Hủy/Đổi Vé của CineTik.
              </span>
            </label>
          </div>

        </div>

        {/* Right Section: Order Summary & Payment Button (Col 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 h-fit sticky top-24">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-rose-500" />
              <span>Tóm Tắt Đơn Hàng</span>
            </h3>

            {/* Movie Info */}
            <div className="space-y-2">
              <div className="text-base font-bold text-rose-400">{showtime.movie?.tenPhim}</div>
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{showtime.cinemaRoom?.tenPhong}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Giờ chiếu: {showtime.thoiGianBatDau}</span>
              </div>
            </div>

            {/* Seats Summary */}
            <div className="pt-4 border-t border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Vị trí ghế ({selectedSeats.length}):</span>
                <span className="font-bold text-white">{selectedSeatLabels}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Tiền ghế:</span>
                <span className="font-bold text-slate-200">{totalSeatPrice.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>

            {/* F&B Summary */}
            {totalFBPrice > 0 && (
              <div className="pt-3 border-t border-slate-800/60 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tiền Bắp Nước F&B:</span>
                  <span className="font-bold text-amber-400">{totalFBPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            )}

            {/* Total Payment Amount */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400">Tổng tiền thanh toán:</div>
              <div className="text-2xl font-extrabold text-rose-500">
                {grandTotal.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <button
            onClick={handlePayment}
            disabled={!agreedToTerms || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg ${
              !agreedToTerms || isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 hover:scale-[1.02]'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang tạo đơn thanh toán...' : 'Thanh Toán VNPay'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
