import React, { useState, useEffect } from 'react';
import { money } from '../utils/helpers';

interface QRModalProps {
  isOpen: boolean;
  orderId: string;
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
}

interface BankOption {
  id: string;
  name: string;
  bin: string; // VietQR Bank BIN / Code
  accNum: string;
  owner: string;
  logo: string;
}

const SUPPORTED_BANKS: BankOption[] = [
  {
    id: 'ICB',
    name: 'VietinBank',
    bin: 'ICB',
    accNum: '102899998888',
    owner: 'CANG TIN TRUONG DAI HOC',
    logo: '🏦',
  },
  {
    id: 'MB',
    name: 'MBBank (Quân Đội)',
    bin: 'MB',
    accNum: '098765432188',
    owner: 'KITTY CANTEEN MANAGEMENT',
    logo: '⭐',
  },
  {
    id: 'VCB',
    name: 'Vietcombank',
    bin: 'VCB',
    accNum: '998877665544',
    owner: 'CANG TIN TRUONG HOC',
    logo: '💳',
  },
  {
    id: 'TCB',
    name: 'Techcombank',
    bin: 'TCB',
    accNum: '190388889999',
    owner: 'CANG TIN TRUONG HOC',
    logo: '🔴',
  },
];

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  orderId,
  amount,
  onConfirm,
  onClose,
}) => {
  const [selectedBank, setSelectedBank] = useState<BankOption>(SUPPORTED_BANKS[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Transfer memo format: CANTEEN <ORDER_ID>
  const memo = `CANTEEN ${orderId}`;

  // VietQR Dynamic URL (compact2 includes NAPAS logo, bank logo, amount and memo)
  const vietQrUrl = `https://img.vietqr.io/image/${selectedBank.bin}-${selectedBank.accNum}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    memo
  )}&accountName=${encodeURIComponent(selectedBank.owner)}`;

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      setIsSimulatingWebhook(false);
      setImgError(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Simulate Instant Bank Webhook (IPN - Instant Payment Notification)
  const handleSimulateWebhook = () => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      setIsSimulatingWebhook(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div
      className="overlay"
      id="qrOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSimulatingWebhook) onClose();
      }}
    >
      <div className="modal p-6 text-center max-w-md max-h-[92vh] overflow-y-auto">
        <button
          className="close-x"
          onClick={onClose}
          disabled={isSimulatingWebhook}
          aria-label="Đóng"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-bold font-display">
            Thanh toán VietQR động (NAPAS 24/7)
          </h2>
        </div>
        <p className="text-xs text-gray-600 mt-0.5 mb-3">
          Mã QR chứa sẵn <b>chính xác số tiền {money(amount)}</b> và mã đơn <b>{orderId}</b>. Quét bằng mọi app Ngân hàng & ví điện tử.
        </p>

        {/* Bank Selector Chips */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-3">
          {SUPPORTED_BANKS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                selectedBank.id === b.id
                  ? 'bg-[#0E4F52] text-white border-black shadow-[2px_2px_0_#221F1A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-stone-100'
              }`}
              onClick={() => {
                setSelectedBank(b);
                setImgError(false);
              }}
            >
              {b.logo} {b.name}
            </button>
          ))}
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-2 mb-2 text-xs">
          <span className="text-gray-500">Mã QR hết hạn sau:</span>
          <span className="font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
            ⏱️ {formatTime(timeLeft)}
          </span>
        </div>

        {/* Dynamic VietQR Image */}
        <div className="relative mx-auto w-full max-w-[280px] bg-white border-2 border-black rounded-2xl p-2 shadow-[4px_4px_0_#221F1A] overflow-hidden">
          {!imgError ? (
            <img
              src={vietQrUrl}
              alt={`VietQR ${orderId}`}
              className="w-full h-auto object-contain rounded-xl"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback SVG QR in case image proxy is temporarily unreachable */
            <div className="p-4 bg-stone-50 border border-dashed border-gray-400 rounded-xl">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-teal-900 to-emerald-950 flex flex-col items-center justify-center text-white rounded-xl shadow-inner p-2">
                <div className="text-3xl font-bold font-mono">VIETQR</div>
                <div className="text-[10px] text-emerald-200 mt-1">NAPAS 24/7</div>
                <div className="text-xs font-bold mt-2 text-amber-300">{money(amount)}</div>
                <div className="text-[11px] font-mono mt-1 text-emerald-100">{memo}</div>
              </div>
            </div>
          )}

          {isSimulatingWebhook && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 rounded-2xl animate-fade-in">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
              <div className="text-sm font-bold">Đang nhận Webhook Ngân hàng...</div>
              <div className="text-[11px] text-emerald-300 mt-1">Mã GD: VQR-{Date.now().toString().slice(-6)} (200 OK)</div>
            </div>
          )}
        </div>

        {/* Details breakdown with 1-click copy */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-left text-xs space-y-2 my-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Chủ tài khoản:</span>
            <span className="font-bold text-gray-800">{selectedBank.owner}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Số tài khoản:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-gray-900">{selectedBank.accNum}</span>
              <button
                type="button"
                className="text-[10px] bg-white border border-gray-300 px-1.5 py-0.5 rounded hover:bg-stone-100"
                onClick={() => handleCopy(selectedBank.accNum, 'acc')}
              >
                {copiedField === 'acc' ? '✓ Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Số tiền:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {money(amount)}
              </span>
              <button
                type="button"
                className="text-[10px] bg-white border border-gray-300 px-1.5 py-0.5 rounded hover:bg-stone-100"
                onClick={() => handleCopy(amount.toString(), 'amount')}
              >
                {copiedField === 'amount' ? '✓ Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-200">
            <div>
              <span className="text-amber-900 block font-semibold">Nội dung chuyển khoản:</span>
              <span className="font-mono font-black text-teal-950 text-sm">{memo}</span>
            </div>
            <button
              type="button"
              className="text-[11px] bg-amber-200 text-amber-950 font-bold border border-amber-400 px-2 py-1 rounded hover:bg-amber-300"
              onClick={() => handleCopy(memo, 'memo')}
            >
              {copiedField === 'memo' ? '✓ Đã chép' : 'Sao chép'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            className="full-btn !py-2.5 font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white"
            onClick={onConfirm}
            disabled={isSimulatingWebhook}
          >
            ✓ Tôi đã chuyển khoản thành công
          </button>

          {/* Teacher / Evaluator Demo Hook */}
          <button
            type="button"
            className="mini-btn w-full !py-2 text-xs font-semibold bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 flex items-center justify-center gap-1.5"
            onClick={handleSimulateWebhook}
            disabled={isSimulatingWebhook}
            title="Mô phỏng tín hiệu Webhook IPN từ ngân hàng tự động cập nhật đơn"
          >
            <span>⚡</span>
            <span>Mô phỏng Webhook Ngân hàng (Tự động khớp lệnh 200 OK)</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          Chuẩn VietQR NAPAS 24/7 tự động điền sẵn số tiền và nội dung để chống sai sót khi sinh viên chuyển khoản.
        </p>
      </div>
    </div>
  );
};
