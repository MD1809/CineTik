import React from 'react';
import { Popcorn, Plus, Minus } from 'lucide-react';

const FBSelector = ({ fbItems = [], quantities = {}, onQuantityChange }) => {
  if (fbItems.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
        Chưa có sản phẩm Bắp Nước F&B khả dụng.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fbItems.map((item) => {
        const qty = quantities[item.id] || 0;
        return (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center space-x-4 transition shadow-md"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
              {item.hinhAnh ? (
                <img src={item.hinhAnh} alt={item.tenItem} className="w-full h-full object-cover" />
              ) : (
                <Popcorn className="w-8 h-8 text-amber-500" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-sm font-bold text-white truncate">{item.tenItem}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{item.moTa || 'Combo thơm ngon chuẩn vị'}</p>
              <div className="text-sm font-extrabold text-rose-500">
                {item.giaTien ? item.giaTien.toLocaleString('vi-VN') : 0} VNĐ
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => onQuantityChange(item, Math.max(0, qty - 1))}
                disabled={qty === 0}
                className={`p-1.5 rounded-lg transition ${
                  qty === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-6 text-center text-sm font-bold text-white">{qty}</span>

              <button
                onClick={() => onQuantityChange(item, qty + 1)}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FBSelector;
