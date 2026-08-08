import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import { Tv, Plus, X, Star, Heart, CheckCircle2, AlertCircle, Settings2 } from 'lucide-react';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [tenPhong, setTenPhong] = useState('');
  const [soLuongGhe, setSoLuongGhe] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllRooms();
      setRooms(data || []);
      if (data && data.length > 0) {
        handleSelectRoom(data[0]);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Không thể tải danh sách phòng chiếu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = async (room) => {
    setSelectedRoom(room);
    try {
      setLoadingSeats(true);
      const seats = await adminService.getRoomSeats(room.id);
      setRoomSeats(seats || []);
    } catch (err) {
      console.error('Error fetching room seats:', err);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!tenPhong) return;

    try {
      setIsSubmitting(true);
      await adminService.createRoom({ tenPhong, soLuongGhe });
      setModalOpen(false);
      setTenPhong('');
      fetchRooms();
    } catch (err) {
      console.error('Error creating room:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo phòng chiếu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeSeatType = async (seat, newType) => {
    try {
      // Optimistic Update
      setRoomSeats((prev) =>
        prev.map((s) => (s.id === seat.id ? { ...s, loaiGhe: newType } : s))
      );
      await adminService.updateSeatType(seat.id, newType);
    } catch (err) {
      console.error('Error updating seat type:', err);
      alert('Có lỗi xảy ra khi cập nhật loại ghế.');
      // Rollback
      if (selectedRoom) handleSelectRoom(selectedRoom);
    }
  };

  // Group seats by Row (hang)
  const seatRows = {};
  roomSeats.forEach((seat) => {
    if (!seatRows[seat.hang]) seatRows[seat.hang] = [];
    seatRows[seat.hang].push(seat);
  });

  const sortedRowKeys = Object.keys(seatRows).sort();
  sortedRowKeys.forEach((key) => {
    seatRows[key].sort((a, b) => a.cot - b.cot);
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-500 rounded-2xl">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Quản Lý Phòng Chiếu & Sơ Đồ Ghế</h1>
            <p className="text-xs text-slate-400 mt-0.5">Tạo phòng chiếu mới và tùy chỉnh cấu hình loại ghế (Đơn/Đôi/VIP)</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 transition flex items-center space-x-2 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phòng Chiếu Mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Layout: Room Selector Tabs + Interactive Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Rooms Selection List Sidebar (Col 1) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh Sách Phòng Chiếu</h3>
          {rooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-950/80 border-rose-600 text-white shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">{room.tenPhong}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Sức chứa: {room.soLuongGhe || 50} Ghế</div>
                </div>
                {isSelected && <Settings2 className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Interactive Seat Configurator Panel (Cols 3) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {selectedRoom ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Cấu Hình Loại Ghế: {selectedRoom.tenPhong}</h2>
                  <p className="text-xs text-slate-400">Nhấp vào ghế bên dưới để thay đổi định dạng loại ghế giữa Ghế Đơn, Ghế VIP, Ghế Đôi</p>
                </div>
              </div>

              {loadingSeats ? (
                <div className="py-12 text-center text-slate-500 text-sm">Đang tải sơ đồ ghế...</div>
              ) : (
                <div className="space-y-8 flex flex-col items-center">
                  
                  {/* Screen Graphic */}
                  <div className="w-full max-w-xl text-center space-y-2">
                    <div className="h-2 w-full bg-rose-600/80 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.6)]"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">MÀN HÌNH CHIẾU (SCREEN)</p>
                  </div>

                  {/* Seat Grid Editor */}
                  <div className="overflow-x-auto max-w-full pb-4 scrollbar-none flex flex-col items-center">
                    <div className="space-y-3 min-w-max px-4">
                      {sortedRowKeys.map((rowKey) => (
                        <div key={rowKey} className="flex items-center space-x-3">
                          <span className="w-6 text-center text-xs font-bold text-slate-400">{rowKey}</span>

                          <div className="flex items-center space-x-2">
                            {seatRows[rowKey].map((seat) => {
                              const isVIP = seat.loaiGhe === 'VIP';
                              const isCouple = seat.loaiGhe === 'COUPLE';
                              const label = `${seat.hang}${seat.cot}`;

                              // Cycle seat type: SINGLE -> VIP -> COUPLE -> SINGLE
                              const nextType = isVIP ? 'COUPLE' : isCouple ? 'SINGLE' : 'VIP';

                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => handleChangeSeatType(seat, nextType)}
                                  className={`h-9 text-xs rounded-lg border transition-all flex items-center justify-center space-x-1 ${
                                    isCouple ? 'w-20' : 'w-9'
                                  } ${
                                    isVIP
                                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                                      : isCouple
                                      ? 'bg-purple-950/60 border-purple-500/80 text-purple-300'
                                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                                  }`}
                                  title={`${label}: Bấm để đổi sang ${nextType}`}
                                >
                                  {isVIP && <Star className="w-3 h-3 text-amber-400 shrink-0" />}
                                  {isCouple && <Heart className="w-3 h-3 text-purple-400 shrink-0" />}
                                  <span>{label}</span>
                                </button>
                              );
                            })}
                          </div>

                          <span className="w-6 text-center text-xs font-bold text-slate-400">{rowKey}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seat Types Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-slate-950 rounded-2xl text-xs border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-slate-950 border border-slate-800"></div>
                      <span className="text-slate-400">Ghế Đơn (SINGLE)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-amber-950/60 border border-amber-500/80 text-amber-400 flex items-center justify-center">
                        <Star className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-amber-300">Ghế VIP (VIP)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-4 rounded bg-purple-950/60 border border-purple-500/80 text-purple-300 flex items-center justify-center">
                        <Heart className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-purple-300">Ghế Đôi (COUPLE)</span>
                    </div>
                  </div>

                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">Vui lòng chọn một phòng chiếu để cấu hình ghế.</div>
          )}
        </div>

      </div>

      {/* Modal Create New Room */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Tạo Phòng Chiếu Phim Mới</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Tên Phòng Chiếu *</label>
                <input
                  type="text"
                  value={tenPhong}
                  onChange={(e) => setTenPhong(e.target.value)}
                  placeholder="VD: Phòng Chiếu 01 (IMAX)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Số Lượng Ghế Khởi Tạo</label>
                <input
                  type="number"
                  value={soLuongGhe}
                  onChange={(e) => setSoLuongGhe(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/60"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo Phòng Chiếu'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
