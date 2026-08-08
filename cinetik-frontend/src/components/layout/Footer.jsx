import React from 'react';
import { Film, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 font-bold text-2xl text-rose-500">
              <Film className="w-8 h-8 text-rose-500" />
              <span>CINETIK</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại số 1 Việt Nam. Trải nghiệm điện ảnh đỉnh cao với chất lượng âm thanh hình ảnh tuyệt hảo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-rose-500 pl-2">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-rose-400 transition-colors">Trang chủ</a></li>
              <li><a href="/movies" className="hover:text-rose-400 transition-colors">Danh sách phim đang chiếu</a></li>
              <li><a href="/showtimes" className="hover:text-rose-400 transition-colors">Lịch chiếu phim</a></li>
              <li><a href="/my-tickets" className="hover:text-rose-400 transition-colors">Tra cứu lịch sử vé đặt</a></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-rose-500 pl-2">Quy định & Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Chính sách thanh toán online</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Quy định đổi trả vé</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Chính sách bảo mật thông tin</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Cảnh báo độ tuổi khi xem phim</span></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-rose-500 pl-2">Liên hệ & Hỗ trợ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-rose-400 font-bold text-lg">
                <Phone className="w-5 h-5" />
                <span>1900-CINETIK</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@cinetik.vn</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span>Tòa nhà CineTik Tower, 123 Đường Điện Ảnh, Hà Nội</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 CineTik Movie Ticket System. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Phát triển bởi đội ngũ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>CineTik Dev Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
