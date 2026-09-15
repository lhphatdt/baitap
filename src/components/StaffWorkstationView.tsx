import React, { useState } from 'react';
import { Order, OrderStatus, Product } from '../types';
import { money, statusMap } from '../utils/helpers';
import { sound } from '../utils/sound';

interface StaffWorkstationViewProps {
  orders: Order[];
  products: Product[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  onUpdateStock: (productId: number, addQty: number) => void;
  onSetOutOfStock: (productId: number) => void;
  onOpenReceipt?: (order: Order) => void;
}

export const StaffWorkstationView: React.FC<StaffWorkstationViewProps> = ({
  orders,
  products,
  onAdvanceOrderStatus,
  onRejectOrder,
  onUpdateStock,
  onSetOutOfStock,
  onOpenReceipt,
}) => {
  const [filterCat, setFilterCat] = useState<string>('Tất cả');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'approved' || o.status === 'preparing' || o.status === 'ready'
  );

  const completedToday = orders.filter((o) => o.status === 'done').length;

  const nextStatusStaff: Record<OrderStatus, OrderStatus | null> = {
    pending: 'approved',
    approved: 'preparing',
    preparing: 'ready',
    ready: 'done',
    done: null,
    cancelled: null,
  };

  const nextBtnLabel: Record<OrderStatus, string> = {
    pending: '✓ Tiếp nhận đơn',
    approved: '🍳 Bắt đầu nấu',
    preparing: '🔔 Nấu xong ➔ Gọi khách lấy',
    ready: '📦 Khách đã nhận khay',
    done: '',
    cancelled: '',
  };

  const handleAdvance = (order: Order) => {
    if (order.status === 'preparing') {
      sound.playKitchenCall();
    }
    onAdvanceOrderStatus(order.id);
  };

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-8" id="view-staff">
      {/* Shift Header */}
      <div className="bg-[#0A3A3C] text-white border-2 border-stone-900 rounded-2xl p-6 mb-6 shadow-[4px_4px_0_#221F1A]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍🍳</span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                BÀN LÀM VIỆC BẾP & QUẦY PHỤC VỤ (KDS)
              </h1>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Hệ thống màn hình bếp (Kitchen Display System) tiếp nhận đơn đặt trước từ sinh viên, cập nhật chu trình nấu nướng và kiểm soát kho nguyên liệu tức thì.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-center">
              <div className="text-[11px] text-emerald-200 uppercase font-bold">Đơn đang đợi làm</div>
              <div className="text-2xl font-black font-display text-amber-300">
                {activeOrders.length}
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-center">
              <div className="text-[11px] text-emerald-200 uppercase font-bold">Đã trả món ca này</div>
              <div className="text-2xl font-black font-display text-emerald-300">
                {completedToday}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: 2 Columns - Orders on left, Inventory on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Orders list (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-stone-900 flex items-center gap-2">
              <span>🍳</span> Hàng đợi chế biến ({activeOrders.length} đơn)
            </h2>
            <div className="text-xs text-stone-500">
              ⚡ Tự động sắp xếp theo thứ tự đặt món
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white border-2 border-stone-900 rounded-2xl p-12 text-center shadow-[4px_4px_0_#221F1A]">
              <div className="text-5xl mb-2">🎉</div>
              <div className="font-bold text-lg text-stone-900">Bếp đã hoàn thành hết đơn hàng!</div>
              <p className="text-xs text-stone-500 mt-1">
                Các đơn hàng mới của sinh viên sẽ tự động đổ chuông và xuất hiện tại đây ngay lập tức.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeOrders.map((o) => {
                const st = statusMap[o.status] || { label: o.status, cls: 'st-pending' };
                const nxt = nextStatusStaff[o.status];
                const btnLabel = nextBtnLabel[o.status];

                return (
                  <div
                    key={o.id}
                    className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[3px_3px_0_#221F1A] flex flex-col justify-between"
                  >
                    <div>
                      {/* Order Ticket Header */}
                      <div className="flex justify-between items-start mb-2 border-b border-stone-200 pb-2">
                        <div>
                          <div className="font-mono font-black text-lg text-stone-900">
                            #{o.id}
                          </div>
                          <div className="text-xs text-stone-500">
                            Khách: <b className="text-stone-800">{o.customerName}</b> ({o.accountId})
                          </div>
                          <div className="text-[11px] text-stone-400">
                            🕒 {o.createdAt} • 📍 {o.addr}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${st.cls} border`}>
                            {st.label}
                          </span>
                          <span className="text-[10px] font-bold text-stone-600">
                            {o.pay === 'QR' ? '⚡ VietQR' : '💵 Tiền mặt'}
                          </span>
                        </div>
                      </div>

                      {/* Items to Cook */}
                      <div className="space-y-1.5 mb-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        {o.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start text-xs border-b border-stone-100 last:border-0 pb-1"
                          >
                            <div>
                              <div className="font-bold text-stone-900">
                                {it.name}
                              </div>
                              {it.note && (
                                <div className="text-[11px] text-red-600 font-semibold italic bg-red-50 px-1.5 py-0.5 rounded border border-red-200 mt-0.5 inline-block">
                                  ⚠️ Lưu ý: {it.note}
                                </div>
                              )}
                            </div>
                            <span className="font-mono font-black text-sm bg-stone-900 text-white px-2 py-0.5 rounded ml-2">
                              ×{it.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-stone-200 space-y-2">
                      <div className="flex gap-2">
                        {onOpenReceipt && (
                          <button
                            type="button"
                            className="flex-1 py-1.5 text-xs font-bold bg-white hover:bg-stone-100 text-stone-800 border border-stone-400 rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                            onClick={() => onOpenReceipt(o)}
                          >
                            <span>🖨️</span>
                            <span>In phiếu</span>
                          </button>
                        )}
                        {nxt && (
                          <button
                            className="flex-2 py-2 text-xs font-bold bg-[#0E4F52] hover:bg-[#0A3A3C] text-white rounded-xl shadow-xs transition-all"
                            onClick={() => handleAdvance(o)}
                          >
                            {btnLabel} ➔
                          </button>
                        )}
                      </div>

                      {o.status === 'pending' && (
                        <div>
                          <button
                            className="w-full text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 py-1.5 rounded-xl"
                            onClick={() => {
                              setRejectId(o.id);
                              setRejectReason('');
                            }}
                          >
                            Hết món / Từ chối đơn
                          </button>

                          {rejectId === o.id && (
                            <div className="reason-box active mt-2 bg-stone-100 p-2 rounded-xl border border-stone-300 space-y-1.5">
                              <input
                                className="w-full text-xs p-1.5 border border-stone-300 rounded bg-white"
                                placeholder="Lý do (VD: Bếp hết cơm, hết sườn...)"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <div className="flex gap-1.5">
                                <button
                                  className="mini-btn danger flex-1 text-xs"
                                  onClick={() => {
                                    onRejectOrder(o.id, rejectReason || 'Bếp hết món đột xuất');
                                    setRejectId(null);
                                  }}
                                >
                                  Xác nhận
                                </button>
                                <button
                                  className="mini-btn flex-1 text-xs"
                                  onClick={() => setRejectId(null)}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Shift Inventory Management */}
        <div>
          <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0_#221F1A]">
            <h2 className="text-base font-bold font-display text-stone-900 mb-1 flex items-center gap-2">
              <span>📦</span> Quản lý tồn kho trong ca trực
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Báo hết món ngay khi hết nguyên liệu hoặc bổ sung số lượng khi nấu mẻ mới.
            </p>

            {/* Quick Category Filter */}
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {['Tất cả', 'Món chính', 'Đồ uống', 'Đồ ăn nhẹ'].map((cat) => (
                <button
                  key={cat}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                    filterCat === cat
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Inventory List */}
            <div className="divide-y divide-stone-200 max-h-[500px] overflow-y-auto pr-1">
              {products
                .filter((p) => filterCat === 'Tất cả' || p.cat === filterCat)
                .map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {p.icon} {p.name}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        <span
                          className={`font-bold ${
                            p.stock > 0 ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {p.stock > 0 ? `Còn: ${p.stock} suất` : 'TẠM HẾT MÓN'}
                        </span>
                        <span>• Đã bán: {p.sold}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="px-2 py-1 text-[11px] font-bold bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded"
                        title="Bổ sung 5 suất"
                        onClick={() => onUpdateStock(p.id, 5)}
                      >
                        +5
                      </button>
                      <button
                        className="px-2 py-1 text-[11px] font-bold bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded"
                        title="Bổ sung 10 suất"
                        onClick={() => onUpdateStock(p.id, 10)}
                      >
                        +10
                      </button>
                      <button
                        className="px-2 py-1 text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded"
                        title="Báo hết món ngay"
                        onClick={() => onSetOutOfStock(p.id)}
                      >
                        Hết
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
