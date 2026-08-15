import React from 'react';
import { Heart, Star, Lock } from 'lucide-react';

const SeatMap = ({ seats = [], selectedSeatIds = [], onToggleSeat, maxSeatsLimit = 8 }) => {
  // Group seats by Row (hang)
  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.hang]) {
      rows[seat.hang] = [];
    }
    rows[seat.hang].push(seat);
  });

  // Sort rows alphabetically (A, B, C...) and columns numerically (1, 2, 3...)
  const sortedRowKeys = Object.keys(rows).sort();
  sortedRowKeys.forEach((key) => {
    rows[key].sort((a, b) => a.cot - b.cot);
  });

  const getSeatStyle = (seat, isSelected) => {
    if (seat.trangThai === 'SOLD') {
      return 'bg-slate-800/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-80';
    }

    if (seat.trangThai === 'LOCKED_BY_OTHER' || (seat.trangThai === 'LOCKED' && !isSelected)) {
      return 'bg-amber-950/70 border-amber-600/80 text-amber-300 cursor-not-allowed shadow-inner opacity-90';
    }

    if (isSelected || seat.trangThai === 'SELECTED_BY_ME') {
      return 'bg-rose-600 border-rose-500 text-white font-bold shadow-lg shadow-rose-950/60 scale-105';
    }

    switch (seat.loaiGhe) {
      case 'VIP':
        return 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/60 hover:border-amber-400';
      case 'COUPLE':
        return 'bg-purple-950/40 border-purple-500/60 text-purple-300 hover:bg-purple-900/60 hover:border-purple-400';
      case 'SINGLE':
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500';
    }
  };

  const isSeatDisabled = (seat) => {
    return seat.trangThai === 'SOLD' || seat.trangThai === 'LOCKED_BY_OTHER';
  };

  const handleSeatClick = (seat) => {
    if (isSeatDisabled(seat)) {
      return;
    }

    const isAlreadySelected = selectedSeatIds.includes(seat.id) || seat.trangThai === 'SELECTED_BY_ME';
    if (!isAlreadySelected && selectedSeatIds.length >= maxSeatsLimit) {
      alert(`Bạn chỉ được chọn tối đa ${maxSeatsLimit} ghế cho mỗi lượt đặt hàng!`);
      return;
    }

    onToggleSeat(seat);
  };

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {/* Screen Graphic */}
      <div className="w-full max-w-2xl text-center space-y-2">
        <div className="h-2.5 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full shadow-[0_0_20px_rgba(225,29,72,0.8)]"></div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">MÀN HÌNH CHIẾU (SCREEN)</p>
      </div>

      {/* Grid Seats Layout */}
      <div className="overflow-x-auto max-w-full pb-4 scrollbar-none flex flex-col items-center">
        <div className="space-y-3 min-w-max px-4">
          {sortedRowKeys.map((rowKey) => (
            <div key={rowKey} className="flex items-center space-x-3">
              {/* Row Label Left */}
              <span className="w-6 text-center text-xs font-bold text-slate-400">{rowKey}</span>

              {/* Seats in Row */}
              <div className="flex items-center space-x-2">
                {rows[rowKey].map((seat) => {
                  const isSelected = selectedSeatIds.includes(seat.id) || seat.trangThai === 'SELECTED_BY_ME';
                  const isLockedByOther = seat.trangThai === 'LOCKED_BY_OTHER';
                  const isCouple = seat.loaiGhe === 'COUPLE';
                  const label = `${seat.hang}${seat.cot}`;

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isSeatDisabled(seat)}
                      className={`h-9 text-xs rounded-lg border transition-all flex items-center justify-center space-x-1 ${
                        isCouple ? 'w-20' : 'w-9'
                      } ${getSeatStyle(seat, isSelected)}`}
                      title={`${label} - ${seat.loaiGhe} ${
                        seat.trangThai === 'SOLD'
                          ? '(Đã bán)'
                          : isLockedByOther
                          ? '(Đang giữ chỗ)'
                          : isSelected
                          ? '(Đang chọn)'
                          : '(Trống)'
                      }`}
                    >
                      {isLockedByOther ? (
                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                      ) : isCouple ? (
                        <Heart className="w-3 h-3 text-purple-400 shrink-0" />
                      ) : null}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-6 text-center text-xs font-bold text-slate-400">{rowKey}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-slate-900 border border-slate-700"></div>
          <span className="text-slate-300">Ghế Đơn</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-amber-950/40 border border-amber-500/60 flex items-center justify-center text-amber-400">
            <Star className="w-3 h-3" />
          </div>
          <span className="text-amber-300">Ghế VIP</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-5 rounded bg-purple-950/40 border border-purple-500/60 flex items-center justify-center text-purple-300">
            <Heart className="w-3 h-3" />
          </div>
          <span className="text-purple-300">Ghế Đôi</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-rose-600 border border-rose-500"></div>
          <span className="text-white font-semibold">Đang chọn</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-amber-950/70 border border-amber-600/80 flex items-center justify-center text-amber-300">
            <Lock className="w-3 h-3" />
          </div>
          <span className="text-amber-300 font-medium">Đang giữ chỗ</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-slate-800/80 border border-slate-800"></div>
          <span className="text-slate-500">Đã bán</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
