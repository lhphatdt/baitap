import React, { useState } from 'react';
import { Account, CartItem, Product } from '../types';
import { bgForCategory, money } from '../utils/helpers';
import { sound } from '../utils/sound';

interface CartViewProps {
  cart: CartItem[];
  products: Product[];
  currentUser: Account | null;
  onRemoveItem: (index: number) => void;
  onUpdateQty: (index: number, newQty: number) => void;
  onCheckout: (
    addr: string,
    phone: string,
    payMethod: 'Tiền mặt' | 'QR',
    voucherCode: string | null,
    coinsUsed: number
  ) => void;
  onGoToMenu: () => void;
  onOpenAuth: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  products,
  currentUser,
  onRemoveItem,
  onUpdateQty,
  onCheckout,
  onGoToMenu,
  onOpenAuth,
}) => {
  const [selectedPay, setSelectedPay] = useState<'Tiền mặt' | 'QR'>('QR');
  const [selectedVoucher, setSelectedVoucher] = useState<string>('');
  const [useCoins, setUseCoins] = useState<boolean>(false);
  const [addr, setAddr] = useState(currentUser?.address || 'Căng tin khu B - Bàn số 5');
  const [phone, setPhone] = useState(currentUser?.phone || '0901234567');

  if (cart.length === 0) {
    return (
      <div className="view-container max-w-4xl mx-auto px-4 py-8" id="view-cart">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 font-display text-stone-900">
          Giỏ đặt món
        </h1>
        <div className="empty-state bg-white border-2 border-stone-900 rounded-2xl p-12 text-center shadow-[4px_4px_0_#221F1A]">
          <div className="text-5xl mb-3">🛒</div>
          <p className="font-bold text-lg text-stone-900">
            Giỏ đặt món của bạn đang trống
          </p>
          <p className="text-sm text-stone-500 mt-1 mb-6 max-w-md mx-auto">
            Hãy khám phá các món ăn nóng sốt và thức uống giải khát mát lạnh tại căng tin nhé!
          </p>
          <button
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-[3px_3px_0_#221F1A] transition-all"
            onClick={onGoToMenu}
          >
            Xem thực đơn ngay ➔
          </button>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = cart.reduce((acc, item) => {
    const prod = products.find((p) => p.id === item.id);
    return acc + (prod ? prod.price * item.qty : 0);
  }, 0);

  // Available vouchers
  const usableVouchers = currentUser?.vouchers.filter((v) => !v.used) || [];
  const activeVoucher = usableVouchers.find((v) => v.code === selectedVoucher);
  const discountPercent = activeVoucher ? activeVoucher.percent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  // Coins calculation
  const userCoins = currentUser?.coins || 0;
  const afterVoucherTotal = Math.max(0, subtotal - discountAmount);
  // Max coins usable cannot exceed total
  const coinsToDeduct = useCoins ? Math.min(userCoins, afterVoucherTotal) : 0;
  const finalTotal = Math.max(0, afterVoucherTotal - coinsToDeduct);

  const handlePlaceOrder = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    sound.playOrderPlaced();
    onCheckout(addr.trim(), phone.trim(), selectedPay, selectedVoucher || null, coinsToDeduct);
  };

  return (
    <div className="view-container max-w-6xl mx-auto px-4 py-8" id="view-cart">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
          Giỏ đặt món ({cart.reduce((s, c) => s + c.qty, 0)} phần)
        </h1>
        <button
          type="button"
          className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
          onClick={onGoToMenu}
        >
          + Thêm món khác từ thực đơn
        </button>
      </div>

      <div className="two-col grid grid-cols-1 lg:grid-cols-12 gap-6" id="cartLayout">
        {/* Selected Items List */}
        <div className="lg:col-span-7 bg-white border-2 border-stone-900 rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0_#221F1A]">
          <h2 className="text-base font-bold mb-3 font-display text-stone-900 flex items-center gap-2">
            <span>🍽️</span> Danh sách món đã chọn
          </h2>

          <div className="divide-y divide-stone-200">
            {cart.map((item, idx) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              return (
                <div key={`${item.id}-${idx}`} className="cart-item py-4 flex gap-4 items-start">
                  <div
                    className="cart-item-img w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-300 flex-shrink-0 flex items-center justify-center relative"
                    style={{ background: bgForCategory(product.cat) }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{product.icon}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 font-display">
                          {product.name}
                        </h4>
                        <div className="text-xs font-semibold text-teal-800">
                          {money(product.price)}
                        </div>
                      </div>
                      <button
                        className="text-stone-400 hover:text-red-600 text-xs font-bold p-1"
                        title="Xóa món"
                        onClick={() => onRemoveItem(idx)}
                      >
                        ✕
                      </button>
                    </div>

                    {item.note && (
                      <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                        ↳ Ghi chú: {item.note}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="qty-ctrl flex items-center bg-stone-100 border border-stone-300 rounded-lg">
                        <button
                          className="px-2.5 py-1 hover:bg-stone-200 font-bold"
                          onClick={() => onUpdateQty(idx, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold font-mono">
                          {item.qty}
                        </span>
                        <button
                          className="px-2.5 py-1 hover:bg-stone-200 font-bold"
                          disabled={item.qty >= product.stock}
                          onClick={() => onUpdateQty(idx, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-stone-900">
                        {money(product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="lg:col-span-5 bg-white border-2 border-stone-900 rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0_#221F1A] space-y-4">
          <h2 className="text-base font-bold font-display text-stone-900 flex items-center gap-2">
            <span>📋</span> Tóm tắt thanh toán
          </h2>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="flex justify-between">
              <span>Tạm tính ({cart.reduce((s, c) => s + c.qty, 0)} phần):</span>
              <span className="font-semibold text-stone-900">{money(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Voucher giảm giá ({activeVoucher?.code} -{discountPercent}%):</span>
                <span>-{money(discountAmount)}</span>
              </div>
            )}

            {coinsToDeduct > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Dùng Xu Canteen Coin:</span>
                <span>-{money(coinsToDeduct)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Phí phục vụ & khay đĩa:</span>
              <span className="font-bold text-emerald-700">0đ (Miễn phí)</span>
            </div>

            <div className="pt-2 border-t border-stone-300 flex justify-between items-center text-sm">
              <span className="font-bold text-stone-900">TỔNG THANH TOÁN:</span>
              <span className="text-lg font-black text-teal-900">{money(finalTotal)}</span>
            </div>
          </div>

          {/* Student Canteen Coin Loyalty Checkbox */}
          {currentUser && userCoins > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useCoinsCheckbox"
                  className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                />
                <label htmlFor="useCoinsCheckbox" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-amber-950">Dùng Xu Kitty Canteen</span>
                  <div className="text-[11px] text-amber-800">
                    Bạn có: <b>{userCoins.toLocaleString('vi-VN')} Xu</b> (1 Xu = 1đ)
                  </div>
                </label>
              </div>
              <span className="text-xs font-bold text-amber-900">
                {useCoins ? `-${money(coinsToDeduct)}` : 'Chưa áp dụng'}
              </span>
            </div>
          )}

          {/* Voucher Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Mã voucher giảm giá:
            </label>
            {usableVouchers.length > 0 ? (
              <select
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 outline-none"
                id="voucherSelect"
                value={selectedVoucher}
                onChange={(e) => setSelectedVoucher(e.target.value)}
              >
                <option value="">Không áp dụng mã giảm</option>
                {usableVouchers.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.code} — Giảm {v.percent}%
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-stone-400">
                Chưa có voucher. Nhập thêm mã tại mục <b>Hồ sơ</b> cá nhân.
              </p>
            )}
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Vị trí nhận món tại căng tin:
            </label>
            <input
              className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 outline-none"
              id="addrInput"
              value={addr}
              placeholder="VD: Bàn số 5 - Tầng 1, Mang đi (Take-away)..."
              onChange={(e) => setAddr(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Số điện thoại liên hệ:
            </label>
            <input
              className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 outline-none"
              id="phoneInput"
              value={phone}
              placeholder="09xxxxxxxx"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
              Phương thức thanh toán:
            </label>
            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedPay === 'QR'
                    ? 'bg-amber-50 border-stone-900 font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
                onClick={() => setSelectedPay('QR')}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-lg">⚡</span>
                  <div>
                    <div className="font-bold text-stone-900">Mã VietQR NAPAS 24/7 (Khuyên dùng)</div>
                    <div className="text-[10px] text-stone-500">Tự động điền số tiền & nội dung, khớp lệnh ngay</div>
                  </div>
                </div>
                <span className="text-xs">{selectedPay === 'QR' ? '✓' : ''}</span>
              </div>

              <div
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedPay === 'Tiền mặt'
                    ? 'bg-amber-50 border-stone-900 font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
                onClick={() => setSelectedPay('Tiền mặt')}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-lg">💵</span>
                  <div>
                    <div className="font-bold text-stone-900">Tiền mặt tại quầy nhận món</div>
                    <div className="text-[10px] text-stone-500">Thanh toán trực tiếp khi nhận khay đồ ăn</div>
                  </div>
                </div>
                <span className="text-xs">{selectedPay === 'Tiền mặt' ? '✓' : ''}</span>
              </div>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            className="w-full py-3.5 bg-teal-800 hover:bg-teal-900 text-white font-black text-sm rounded-xl border-2 border-stone-900 shadow-[4px_4px_0_#221F1A] transition-all flex items-center justify-center gap-2 mt-2"
            id="placeOrderBtn"
            onClick={handlePlaceOrder}
          >
            <span>🚀</span>
            <span>Xác nhận đặt hàng • {money(finalTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
