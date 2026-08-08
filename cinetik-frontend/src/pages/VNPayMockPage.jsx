import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { vnpayService } from '../api/vnpayService';
import { ShieldCheck, CreditCard, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function VNPayMockPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ticketCode = searchParams.get('vnp_TxnRef') || '';
  const amount = searchParams.get('vnp_Amount') || '0';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMockPayment = async (isSuccess) => {
    if (!ticketCode) {
      alert('Không tìm thấy mã đơn hàng thanh toán vnp_TxnRef!');
      return;
    }

    try {
      setIsSubmitting(true);
      await vnpayService.processMockPay(ticketCode, isSuccess);
      
      const statusParam = isSuccess ? 'success' : 'failed';
      navigate(`/payment/result?ticketCode=${ticketCode}&status=${statusParam}`);
    } catch (err) {
      console.error('Error processing mock payment:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý giả lập thanh toán.');
      setIsSubmitting(false);
    }
  };

  const formattedAmount = Number(amount).toLocaleString('vi-VN');

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl space-y-6">
        
        {/* VNPay Mock Brand Header */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 font-bold px-4 py-1.5 rounded-full text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>VNPAY DEV SANDBOX GATEWAY</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Cổng Thanh Toán Giả Lập</h2>
          <p className="text-xs text-slate-400">Môi trường thử nghiệm thanh toán dành cho Lập trình viên</p>
        </div>

        {/* Order Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Đơn vị chấp nhận:</span>
            <span className="font-bold text-white">CINETIK CINEMA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Mã vé (vnp_TxnRef):</span>
            <span className="font-mono font-bold text-rose-400 text-base">{ticketCode || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 font-medium">Số tiền thanh toán:</span>
            <span className="font-extrabold text-blue-400 text-xl">{formattedAmount} VNĐ</span>
          </div>
        </div>

        {/* Mock Payment Simulation Actions */}
        <div className="space-y-3 pt-2">
          <p className="text-xs text-center text-slate-400 font-medium">
            Vui lòng chọn kết quả thanh toán bạn muốn giả lập:
          </p>

          <button
            onClick={() => handleMockPayment(true)}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang xử lý...' : 'Xác nhận Thanh toán Thành công'}</span>
          </button>

          <button
            onClick={() => handleMockPayment(false)}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-slate-800 hover:bg-rose-950/80 hover:border-rose-800 text-rose-400 hover:text-rose-300 border border-slate-700 font-semibold text-sm rounded-xl transition flex items-center justify-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Thanh toán Thất bại / Hủy giao dịch</span>
          </button>
        </div>

      </div>
    </div>
  );
}
