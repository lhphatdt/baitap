import React from 'react';
import { Order } from '../types';

interface QueueBoardViewProps {
  orders: Order[];
  onGoToMenu: () => void;
}

export const QueueBoardView: React.FC<QueueBoardViewProps> = ({ orders, onGoToMenu }) => {
  const preparingOrders = orders.filter((o) => o.status === 'preparing' || o.status === 'approved');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const doneOrders = orders.filter((o) => o.status === 'done').slice(0, 6);

  return (
    <div className="view-container" id="view-queue">
      {/* Header Banner */}
      <div className="bg-[#0E4F52] text-white border-2 border-black rounded-2xl p-6 mb-6 shadow-[4px_4px_0_#221F1A] flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📢</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              BẢNG GỌI SỐ LẤY MÓN TẠI QUẦY
            </h1>
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            Theo dõi số thứ tự đơn hàng của bạn. Khi đơn chuyển sang cột "MỜI NHẬN MÓN", vui lòng mang hóa đơn đến quầy để nhận thức ăn nhé!
          </p>
        </div>
        <button
          className="mini-btn bg-amber-400 text-black font-bold px-4 py-2 border-2 border-black hover:bg-amber-300"
          onClick={onGoToMenu}
        >
          + Gọi món mới
        </button>
      </div>

      {/* Main Dual Screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Preparing */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0_#221F1A]">
          <div className="flex items-center justify-between border-b-2 border-[#DAD5C8] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 border border-black animate-pulse" />
              <h2 className="text-xl font-bold font-display text-amber-900 uppercase tracking-wide">
                Đang chuẩn bị ({preparingOrders.length})
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">Bếp đang nấu...</span>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🍳</div>
              <p>Hiện không có đơn nào đang chờ chuẩn bị</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {preparingOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 text-center shadow-sm"
                >
                  <div className="text-2xl font-black font-display text-amber-950">
                    {o.id}
                  </div>
                  <div className="text-xs text-amber-800 truncate mt-1">
                    {o.items.map((i) => i.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Ready for Pickup */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0_#221F1A]">
          <div className="flex items-center justify-between border-b-2 border-[#DAD5C8] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 border border-black animate-ping" />
              <h2 className="text-xl font-bold font-display text-emerald-800 uppercase tracking-wide">
                Mời lấy món ({readyOrders.length})
              </h2>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              Sẵn sàng tại quầy
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🛎️</div>
              <p>Chưa có đơn nào sẵn sàng lấy món</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {readyOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3 text-center shadow-md animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  <div className="text-2xl font-black font-display text-emerald-900">
                    {o.id}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 truncate mt-1">
                    {o.customerName}
                  </div>
                  <div className="text-[10px] text-emerald-600">Đã xong! Tới quầy ngay</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently picked up */}
      {doneOrders.length > 0 && (
        <div className="mt-8 bg-stone-100 border border-[#DAD5C8] rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs font-bold text-gray-600 uppercase">
            ✓ Các số vừa hoàn tất nhận món gần nhất:
          </div>
          <div className="flex gap-2 flex-wrap">
            {doneOrders.map((o) => (
              <span
                key={o.id}
                className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded text-xs font-bold"
              >
                #{o.id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
