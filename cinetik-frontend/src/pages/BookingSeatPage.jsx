import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../api/bookingService';
import SeatMap from '../components/booking/SeatMap';
import CountdownTimer from '../components/booking/CountdownTimer';
import { ArrowLeft, Ticket, AlertCircle, Popcorn, Clock, MapPin } from 'lucide-react';

export default function BookingSeatPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to track if navigating to checkout (so we don't release seat locks on unmount)
  const isNavigatingToCheckoutRef = useRef(false);

  // Key trigger to reset countdown timer back to 300s
  const [timerKey, setTimerKey] = useState(0);

  // Timeout Modal state
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [showtimeId]);

  // Polling 3s loop for seat statuses
  useEffect(() => {
    if (!showtimeId) return;

    const intervalId = setInterval(() => {
      fetchSeatsStatus(false);
    }, 3000);

    return () => {
      clearInterval(intervalId);
      // Best-effort release locks on leave (unless going to checkout)
      if (!isNavigatingToCheckoutRef.current) {
        bookingService.releaseMySeats(showtimeId).catch(() => {});
      }
    };
  }, [showtimeId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const stData = await bookingService.getShowtimeDetail(showtimeId);
      setShowtime(stData);

      await fetchSeatsStatus(true);
    } catch (err) {
      console.error('Error fetching showtime/seats:', err);
      setError('Không thể tải sơ đồ ghế cho suất chiếu này.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsStatus = async (isFirstLoad = false) => {
    try {
      const seatsStatusData = await bookingService.getSeatsStatus(showtimeId);
      if (seatsStatusData) {
        setSeats(seatsStatusData);

        // Derive selected seats belonging to current user
        const mySelected = seatsStatusData.filter((s) => s.trangThai === 'SELECTED_BY_ME');
        setSelectedSeats(mySelected);
      }
    } catch (err) {
      console.error('Error polling seat statuses:', err);
      if (isFirstLoad) {
        setError('Không thể lấy danh sách trạng thái ghế.');
      }
    }
  };

  const handleToggleSeat = async (seat) => {
    if (seat.trangThai === 'SOLD' || seat.trangThai === 'LOCKED_BY_OTHER') {
      return;
    }

    const isAlreadySelected = seat.trangThai === 'SELECTED_BY_ME' || selectedSeats.some((s) => s.id === seat.id);

    try {
      if (isAlreadySelected) {
        // Unlock / Deselect single seat
        await bookingService.releaseSingleSeat(showtimeId, seat.id);
        await fetchSeatsStatus();
      } else {
        // Lock / Select single seat
        if (selectedSeats.length >= 8) {
          alert('Bạn chỉ được chọn tối đa 8 ghế cho mỗi lượt đặt vé!');
          return;
        }

        await bookingService.lockSingleSeat(showtimeId, seat.id);
        await fetchSeatsStatus();
      }
    } catch (err) {
      console.error('Error toggling seat lock:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ghế. Vui lòng thử lại!');
      fetchSeatsStatus();
    }
  };

  const [priceCalculation, setPriceCalculation] = useState(null);

  useEffect(() => {
    if (showtime && selectedSeats.length > 0) {
      fetchPriceCalculation();
    } else {
      setPriceCalculation(null);
    }
  }, [selectedSeats, showtime]);

  const fetchPriceCalculation = async () => {
    try {
      const seatIds = selectedSeats.map((s) => s.id);
      const calcRes = await bookingService.calculatePrice(showtime.id, seatIds);
      setPriceCalculation(calcRes);
    } catch (err) {
      console.error('Error calculating price:', err);
    }
  };

  const calculateTotalPrice = () => {
    if (priceCalculation && priceCalculation.tongTien !== undefined) {
      return priceCalculation.tongTien;
    }
    if (!showtime) return 0;
    let total = 0;
    selectedSeats.forEach((seat) => {
      let basePrice = 80000;
      if (seat.loaiGhe === 'VIP') basePrice = 100000;
      if (seat.loaiGhe === 'COUPLE') basePrice = 150000;
      total += basePrice;
    });
    return total;
  };

  const handleTimeout = () => {
    setTimeoutModalOpen(true);
  };

  const handleConfirmTimeout = async () => {
    setTimeoutModalOpen(false);
    try {
      await bookingService.releaseMySeats(showtimeId);
    } catch (e) {}
    setSelectedSeats([]);
    setTimerKey((prev) => prev + 1);
    fetchSeatsStatus();
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 vị trí ghế để tiếp tục!');
      return;
    }

    // Flag that we are proceeding to checkout so unmount won't release seats
    isNavigatingToCheckoutRef.current = true;

    // Navigate to checkout page
    navigate('/booking/checkout', {
      state: {
        showtime,
        selectedSeats,
        totalSeatPrice: calculateTotalPrice(),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Không tải được suất chiếu</h3>
        <p className="text-slate-400 text-sm mb-6">{error || 'Suất chiếu không tồn tại.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    );
  }

  const selectedSeatLabels = selectedSeats.map((s) => `${s.hang}${s.cot}`).join(', ');
  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white">{showtime.movie?.tenPhim}</h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-3">
              <span>{showtime.cinemaRoom?.tenPhong}</span>
              <span>•</span>
              <span>{showtime.thoiGianBatDau ? showtime.thoiGianBatDau.substring(11, 16) : ''}</span>
            </p>
          </div>
        </div>

        {/* 5-Minute Timer - Only active when at least 1 seat is selected */}
        <CountdownTimer
          key={timerKey}
          resetKey={timerKey}
          initialSeconds={300}
          isActive={selectedSeats.length > 0}
          onTimeout={handleTimeout}
        />
      </div>

      {/* Main Seat Map Grid & Checkout Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Seat Map (Cols 2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeats.map((s) => s.id)}
            onToggleSeat={handleToggleSeat}
            maxSeatsLimit={8}
          />
        </div>

        {/* Booking Summary Panel (Col 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 h-fit sticky top-24">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-rose-500" />
              <span>Thông Tin Đặt Vé</span>
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

            {/* Selected Seats List */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400">Vị trí ghế đã chọn:</div>
              {selectedSeats.length === 0 ? (
                <div className="text-xs text-slate-500 italic">Chưa chọn vị trí ghế nào</div>
              ) : (
                <div className="text-sm font-bold text-white tracking-wide bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedSeatLabels}
                </div>
              )}
            </div>

            {/* Applied Pricing Adjustments (Surcharges & Discounts) */}
            {priceCalculation && priceCalculation.appliedAdjustments && priceCalculation.appliedAdjustments.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="font-semibold text-slate-400">Các khoản Phụ thu / Giảm giá:</div>
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {priceCalculation.appliedAdjustments.map((adj, idx) => {
                    const isSurcharge = adj.loaiDieuChinh === 'SURCHARGE';
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">{adj.tenQuyTac}</span>
                        <span className={`font-bold ${isSurcharge ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {isSurcharge ? '+' : ''}
                          {Number(adj.soTien).toLocaleString('vi-VN')} VNĐ/vé
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Total */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400">Tạm tính tiền ghế:</div>
              <div className="text-xl font-extrabold text-rose-500">
                {totalPrice.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0 || isSubmitting}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg ${
              selectedSeats.length === 0 || isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 hover:scale-[1.02]'
            }`}
          >
            <Popcorn className="w-5 h-5" />
            <span>Tiếp tục (Chọn Bắp Nước)</span>
          </button>
        </div>
      </div>

      {/* Timeout Warning Modal */}
      {timeoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Đã hết 5 phút giữ ghế!</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Thời gian giữ chỗ tạm thời cho suất chiếu này đã kết thúc. Vui lòng chọn lại ghế để tiếp tục đặt vé.
            </p>
            <button
              onClick={handleConfirmTimeout}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-rose-950/50"
            >
              Đã hiểu & Chọn lại ghế
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
