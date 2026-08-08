import React from 'react';
import { Film, Ticket, ShieldCheck, Sparkles, Popcorn, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-[#111827]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white via-gray-200 to-red-500 bg-clip-text text-transparent">
              CineTik
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
              Đăng nhập
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/30 transition flex items-center space-x-2">
              <Ticket className="w-4 h-4" />
              <span>Đặt vé ngay</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-[#131B2E] to-gray-900 border border-gray-800 p-8 sm:p-12 md:p-16 shadow-2xl mb-12">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Trải Nghiệm Điện Ảnh Đỉnh Cao</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Chào mừng bạn đến với <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">CineTik</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8">
              Hệ thống bán vé xem phim trực tuyến hiện đại. Chọn suất chiếu, đặt vị trí ghế Đơn / Đôi / VIP trực quan, giữ ghế 5 phút và mua bắp nước tiện lợi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-xl shadow-red-600/30 transition flex items-center space-x-2">
                <Ticket className="w-5 h-5" />
                <span>Khám phá suất chiếu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/40 text-red-500 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Giữ ghế 5 Phút</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tự động tạm khóa vị trí ghế đã chọn trong 5 phút qua hệ thống Redis để đảm bảo bạn hoàn tất thanh toán an toàn.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-500 flex items-center justify-center mb-4">
              <Popcorn className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Combo F&B Tiện Lợi</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Đặt mua bắp nước trực tiếp cùng vé xem phim. Nhận đồ ăn nước uống ngay tại rạp khi check-in soát vé.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-500 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Thanh Toán VNPay</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tích hợp thanh toán trực tuyến an toàn qua cổng VNPay, nhận mã vé 10 ký tự qua Email xác nhận tự động.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#111827] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2026 CineTik MVP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
