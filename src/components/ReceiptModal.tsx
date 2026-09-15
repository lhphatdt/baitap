import React from 'react';
import { Order } from '../types';
import { money } from '../utils/helpers';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="overlay"
      id="receiptOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal p-6 max-w-md max-h-[92vh] overflow-y-auto text-center font-sans">
        <button className="close-x" onClick={onClose} aria-label="Đóng">
          ✕
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🖨️</span>
          <h2 className="text-xl font-bold font-display">Phiếu Gọi Món Căng Tin</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Phiếu in nhiệt tiêu chuẩn dùng để đối chiếu khi nhận đồ ăn tại quầy
        </p>

        {/* Thermal Slip Simulation */}
        <div
          id="printableReceipt"
          className="bg-white border-2 border-stone-800 rounded-lg p-5 text-left text-stone-900 shadow-[4px_4px_0_#221F1A] font-mono text-xs relative"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-stone-400 pb-3 mb-3">
            <div className="text-lg font-black tracking-wide flex items-center justify-center gap-1">
              <span>🐾</span> KITTY CANTEEN
            </div>
            <div className="text-[11px] text-stone-600">Đại Học Bách Khoa • Khu Căn Tin Sinh Viên</div>
            <div className="text-[10px] text-stone-500">Hotline: 1900-6868 • Wifi: Canteen_Free</div>
            <div className="mt-2 inline-block bg-stone-900 text-white px-3 py-1 rounded text-xs font-bold">
              {order.pay === 'QR' ? '✓ ĐÃ THANH TOÁN (VIETQR)' : 'TIỀN MẶT KHI NHẬN MÓN'}
            </div>
          </div>

          {/* Queue Big Call Number */}
          <div className="text-center my-3 bg-stone-100 p-2.5 rounded border border-stone-300">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Số thứ tự nhận món</div>
            <div className="text-3xl font-black text-stone-900 tracking-wider my-0.5">
              #{order.id}
            </div>
            <div className="text-[11px] text-teal-800 font-bold">
              ⏱️ Thời gian dự kiến: {order.estimatedWaitMinutes || 7} phút
            </div>
          </div>

          {/* Metadata info */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-2 mb-3">
            <div className="flex justify-between">
              <span className="text-stone-500">Khách hàng:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Mã sinh viên:</span>
              <span>{order.accountId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Thời gian đặt:</span>
              <span>{order.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Nơi nhận món:</span>
              <span className="font-bold">{order.addr}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-b-2 border-dashed border-stone-400 pb-3 mb-3">
            <div className="flex justify-between font-bold text-stone-700 pb-1 border-b border-stone-200 mb-1.5">
              <span>MÓN & SỐ LƯỢNG</span>
              <span>THÀNH TIỀN</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">
                      {item.qty}x {item.name}
                    </div>
                    {item.note && (
                      <div className="text-[10px] text-stone-500 italic pl-3">
                        ↳ Ghi chú: {item.note}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-right whitespace-nowrap">
                    {money(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="space-y-1 text-xs border-b-2 border-dashed border-stone-400 pb-2 mb-3">
            {order.voucher && (
              <div className="flex justify-between text-emerald-800">
                <span>Voucher giảm giá ({order.voucher}):</span>
                <span>Áp dụng</span>
              </div>
            )}
            {order.coinsUsed && order.coinsUsed > 0 && (
              <div className="flex justify-between text-amber-800">
                <span>Dùng Canteen Coins:</span>
                <span>-{money(order.coinsUsed)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-stone-900 pt-1">
              <span>TỔNG CỘNG:</span>
              <span className="text-base text-stone-900">{money(order.total)}</span>
            </div>
          </div>

          {/* Barcode & Footer */}
          <div className="text-center pt-1 space-y-1">
            <div className="text-[10px] tracking-widest text-stone-400 font-mono select-none">
              ||| | ||||| || |||| ||| ||||||| | |||
            </div>
            <div className="text-[10px] text-stone-500">
              * Quý khách vui lòng giữ phiếu để đối chiếu tại quầy nhận món *
            </div>
            <div className="text-[11px] font-bold text-stone-800 mt-1">
              Chúc bạn ngon miệng & một ngày học tập hứng khởi! 🌟
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="mini-btn flex-1 !py-2 text-xs font-bold bg-white hover:bg-stone-100 border-stone-300"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            type="button"
            className="full-btn flex-2 !py-2 text-xs font-bold flex items-center justify-center gap-1.5"
            onClick={handlePrint}
          >
            <span>🖨️</span>
            <span>In phiếu / Xuất file (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
