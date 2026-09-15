import React from 'react';
import { Order } from '../types';
import { money, statusMap } from '../utils/helpers';

interface OrdersViewProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onGoToMenu: () => void;
  onOpenQR?: (orderId: string, amount: number) => void;
  onOpenReceipt?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onCancelOrder,
  onGoToMenu,
  onOpenQR,
  onOpenReceipt,
}) => {
  if (orders.length === 0) {
    return (
      <div className="view-container max-w-4xl mx-auto px-4 py-8" id="view-orders">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 font-display text-stone-900">
          Lịch sử đơn hàng
        </h1>
        <div className="empty-state bg-white border-2 border-stone-900 rounded-2xl p-12 text-center shadow-[4px_4px_0_#221F1A]">
          <div className="text-5xl mb-3">📦</div>
          <p className="font-bold text-lg text-stone-900">
            Bạn chưa có đơn hàng nào
          </p>
          <p className="text-sm text-stone-500 mt-1 mb-6 max-w-md mx-auto">
            Khi bạn đặt món, tiến trình chuẩn bị từ lúc duyệt, nấu cho tới khi sẵn sàng lấy tại quầy sẽ cập nhật theo thời gian thực!
          </p>
          <button
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-[3px_3px_0_#221F1A] transition-all"
            onClick={onGoToMenu}
          >
            Khám phá thực đơn ➔
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container max-w-5xl mx-auto px-4 py-8" id="view-orders">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Đơn hàng của tôi ({orders.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi tiến trình bếp & in phiếu nhận món tại quầy căng tin
          </p>
        </div>
        <button
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-[2px_2px_0_#221F1A] transition-all"
          onClick={onGoToMenu}
        >
          + Đặt thêm món
        </button>
      </div>

      <div id="ordersList" className="space-y-4">
        {orders.map((o) => {
          const st = statusMap[o.status] || { label: o.status, cls: 'st-pending' };
          return (
            <div
              key={o.id}
              className="order-card bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0_#221F1A] transition-all"
              id={`order-card-${o.id}`}
            >
              {/* Card Top Details */}
              <div className="order-top flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="order-id text-base font-black font-mono text-stone-900">
                      Mã đơn: #{o.id}
                    </span>
                    <span className={`status-pill ${st.cls} text-xs px-2.5 py-0.5 rounded-full font-bold border`}>
                      {st.label}
                    </span>
                    {o.status === 'preparing' && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                        ⏱️ Dự kiến: ~{o.estimatedWaitMinutes || 5} phút
                      </span>
                    )}
                  </div>
                  <div className="order-date text-xs text-stone-500 mt-1">
                    🕒 Đặt lúc: {o.createdAt} • 📍 Nhận tại: <b className="text-stone-700">{o.addr}</b>
                  </div>
                </div>

                {/* Pickup Ready Alert */}
                {o.status === 'ready' && (
                  <div className="bg-purple-100 text-purple-950 border-2 border-purple-400 px-3 py-1.5 rounded-xl text-xs font-black animate-pulse flex items-center gap-1.5 shadow-xs">
                    <span>🔔</span>
                    <span>MÓN ĐÃ NẤU XONG! Mời bạn tới Quầy Tầng 1 nhận món</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="order-items bg-stone-50 p-3.5 rounded-xl border border-stone-200 my-3 text-xs space-y-1.5">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5">
                    <div>
                      <span className="font-bold text-stone-900">
                        {it.qty}x {it.name}
                      </span>
                      {it.note && (
                        <span className="text-stone-500 italic ml-2">
                          (Ghi chú: {it.note})
                        </span>
                      )}
                    </div>
                    <span className="text-stone-700 font-semibold font-mono">
                      {money(it.price * it.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cancellation Reason */}
              {o.cancelReason && (
                <div className="my-2 text-xs text-red-700 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ Lý do từ chối/hủy: {o.cancelReason}
                </div>
              )}

              {/* Footer row with Payment info, Total & Actions */}
              <div className="order-foot pt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-stone-600 space-y-0.5">
                  <div>
                    Thanh toán:{' '}
                    <b className="text-stone-900">
                      {o.pay === 'QR' ? '⚡ Chuyển khoản VietQR' : '💵 Tiền mặt khi nhận'}
                    </b>
                    {o.voucher && (
                      <span className="ml-2 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[11px] font-bold">
                        Voucher: {o.voucher}
                      </span>
                    )}
                    {o.coinsUsed && o.coinsUsed > 0 && (
                      <span className="ml-2 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 text-[11px] font-bold">
                        Dùng Xu: -{money(o.coinsUsed)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="price text-lg font-black text-teal-900 mr-1">
                    {money(o.total)}
                  </span>

                  {/* Print Thermal Slip Button */}
                  {onOpenReceipt && (
                    <button
                      type="button"
                      className="text-xs font-bold bg-white hover:bg-stone-100 text-stone-800 border-2 border-stone-800 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all"
                      onClick={() => onOpenReceipt(o)}
                    >
                      <span>🖨️</span>
                      <span>In phiếu món</span>
                    </button>
                  )}

                  {/* Open Dynamic VietQR */}
                  {o.status === 'pending' && o.pay === 'QR' && onOpenQR && (
                    <button
                      type="button"
                      className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-stone-900 border-2 border-stone-900 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all"
                      onClick={() => onOpenQR(o.id, o.total)}
                    >
                      <span>⚡</span>
                      <span>Mã VietQR</span>
                    </button>
                  )}

                  {/* Cancel Order if still pending */}
                  {o.status === 'pending' && (
                    <button
                      className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-1.5 rounded-xl transition-all"
                      id={`cancel-order-btn-${o.id}`}
                      onClick={() => onCancelOrder(o.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
