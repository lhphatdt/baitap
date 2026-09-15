import React, { useState } from 'react';
import { Account, Product } from '../types';
import { bgForCategory, money } from '../utils/helpers';

interface ProfileViewProps {
  currentUser: Account;
  products: Product[];
  onUpdateInfo: (name: string, phone: string, address: string) => void;
  onUpdateAvatar: (avatarUrl: string) => void;
  onUpdatePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  onRedeemVoucher: (code: string) => { success: boolean; message: string };
  onAddToCart: (product: Product, qty: number, note: string) => void;
  onToggleFavorite: (productId: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  products,
  onUpdateInfo,
  onUpdateAvatar,
  onUpdatePassword,
  onRedeemVoucher,
  onAddToCart,
  onToggleFavorite,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [infoSaved, setInfoSaved] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(currentUser.avatar || '');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [passError, setPassError] = useState('');
  const [passOk, setPassOk] = useState(false);

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherOk, setVoucherOk] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateAvatar(reader.result);
          setCustomAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyAvatarUrl = () => {
    if (customAvatarUrl.trim()) {
      onUpdateAvatar(customAvatarUrl.trim());
    }
  };

  const avatarPresets = [
    { label: 'Sinh viên nữ', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: 'Sinh viên nam', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { label: 'Đầu bếp', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80' },
    { label: 'Quản lý', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSaveInfo = () => {
    onUpdateInfo(name.trim() || currentUser.name, phone.trim(), address.trim());
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2500);
  };

  const handleSavePass = () => {
    setPassError('');
    setPassOk(false);
    if (!oldPass || !newPass) {
      setPassError('Vui lòng điền mật khẩu hiện tại và mật khẩu mới.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('Mật khẩu mới cần tối thiểu 6 ký tự.');
      return;
    }
    if (newPass !== newPass2) {
      setPassError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    const res = onUpdatePassword(oldPass, newPass);
    if (!res.success) {
      setPassError(res.message);
    } else {
      setPassOk(true);
      setOldPass('');
      setNewPass('');
      setNewPass2('');
      setTimeout(() => setPassOk(false), 3000);
    }
  };

  const handleRedeem = () => {
    setVoucherError('');
    setVoucherOk('');
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã giảm giá.');
      return;
    }
    const res = onRedeemVoucher(voucherCode.trim());
    if (!res.success) {
      setVoucherError(res.message);
    } else {
      setVoucherOk(res.message);
      setVoucherCode('');
      setTimeout(() => setVoucherOk(''), 3000);
    }
  };

  const favoriteProducts = (currentUser.favorites || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="view-container" id="view-profile">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 font-display">
        Hồ sơ cá nhân ({currentUser.id})
      </h1>

      <div className="profile-grid">
        {/* Left Column: Personal info & Password */}
        <div>
          <div className="profile-card">
            <div className="section-title">Ảnh đại diện (Avatar)</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full border-2 border-black overflow-hidden bg-emerald-100 flex items-center justify-center text-3xl shadow-[2px_2px_0_#221F1A] flex-shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : currentUser.role === 'customer' ? (
                  '🎓'
                ) : currentUser.role === 'staff' ? (
                  '🍳'
                ) : (
                  '🛠️'
                )}
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-sm">{currentUser.name}</div>
                <div className="text-gray-500 mb-2">Tải ảnh đại diện từ máy tính hoặc chọn ảnh mẫu bên dưới.</div>
                <label className="mini-btn primary inline-block cursor-pointer">
                  📁 Tải ảnh từ máy tính
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Chọn nhanh avatar mẫu:
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {avatarPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="mini-btn text-xs flex items-center gap-1.5 bg-stone-50"
                  onClick={() => {
                    onUpdateAvatar(preset.url);
                    setCustomAvatarUrl(preset.url);
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="field-label">Hoặc dán liên kết ảnh (URL):</div>
            <div className="flex gap-2">
              <input
                className="field-input text-xs"
                placeholder="https://..."
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
              />
              <button
                type="button"
                className="mini-btn"
                onClick={handleApplyAvatarUrl}
              >
                Cập nhật
              </button>
            </div>
          </div>

          <div className="profile-card">
            <div className="section-title">Thông tin tài khoản</div>
            <div className="text-xs text-gray-500 mb-3">
              Mã tài khoản: <b>{currentUser.id}</b> • Vai trò:{' '}
              <b className="capitalize text-teal-800">{currentUser.role}</b>
            </div>

            <div className="field-label">Tên hiển thị</div>
            <input
              className="field-input"
              id="pfName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
            />

            <div className="field-label">Số điện thoại liên hệ</div>
            <input
              className="field-input"
              id="pfPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxx"
            />

            <div className="field-label">Vị trí / Địa chỉ nhận món mặc định</div>
            <input
              className="field-input"
              id="pfAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Căng tin tầng 1, Phòng A2.03, Tòa nhà B..."
            />

            {infoSaved && (
              <div className="ok-text show text-sm mt-2">
                ✓ Đã lưu thay đổi thông tin cá nhân!
              </div>
            )}

            <button
              className="full-btn mt-4"
              id="pfSaveInfoBtn"
              onClick={handleSaveInfo}
            >
              Lưu thay đổi thông tin
            </button>
          </div>

          <div className="profile-card">
            <div className="section-title">Đổi mật khẩu</div>

            <div className="field-label">Mật khẩu hiện tại</div>
            <input
              className="field-input"
              type="password"
              id="pfOldPass"
              value={oldPass}
              placeholder="Nhập mật khẩu hiện tại"
              onChange={(e) => setOldPass(e.target.value)}
            />

            <div className="field-label">Mật khẩu mới</div>
            <input
              className="field-input"
              type="password"
              id="pfNewPass"
              placeholder="Tối thiểu 6 ký tự"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <div className="field-label">Xác nhận mật khẩu mới</div>
            <input
              className="field-input"
              type="password"
              id="pfNewPass2"
              placeholder="Nhập lại mật khẩu mới"
              value={newPass2}
              onChange={(e) => setNewPass2(e.target.value)}
            />

            {passError && (
              <div className="error-text show mt-2">{passError}</div>
            )}
            {passOk && (
              <div className="ok-text show mt-2">
                ✓ Cập nhật mật khẩu thành công!
              </div>
            )}

            <button
              className="full-btn mt-4"
              id="pfSavePassBtn"
              onClick={handleSavePass}
            >
              Cập nhật mật khẩu mới
            </button>
          </div>
        </div>

        {/* Right Column: Coins, Vouchers & Favorites */}
        <div>
          {/* Kitty Canteen Coins Card */}
          <div className="profile-card bg-amber-50/50 border-amber-300 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="section-title text-amber-950 flex items-center gap-2 mb-0">
                <span>🪙</span> Ví Xu Tích Lũy Kitty Canteen
              </div>
              <span className="text-[11px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                1 Xu = 1đ
              </span>
            </div>

            <div className="bg-white border-2 border-stone-900 rounded-xl p-4 shadow-[2px_2px_0_#221F1A] my-3">
              <div className="text-xs text-stone-500 font-semibold">Số dư khả dụng:</div>
              <div className="text-3xl font-black font-display text-amber-900 flex items-center gap-2 mt-0.5">
                <span>{(currentUser.coins || 0).toLocaleString('vi-VN')}</span>
                <span className="text-sm font-bold text-amber-700 font-sans">Xu Canteen</span>
              </div>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                🎉 Bạn được tích lũy <b>5%</b> giá trị cho mỗi đơn hàng hoàn tất. Dùng số xu này để <b>khấu trừ trực tiếp tiền món</b> ngay trong giỏ hàng!
              </p>
            </div>
          </div>

          <div className="profile-card">
            <div className="section-title">Mã khuyến mãi của tôi</div>

            <div id="voucherList" className="space-y-2 mb-4">
              {currentUser.vouchers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Bạn chưa có mã giảm giá nào.
                </p>
              ) : (
                currentUser.vouchers.map((v) => (
                  <div
                    key={v.code}
                    className={`voucher-chip ${v.used ? 'disabled' : ''}`}
                  >
                    <div>
                      <span className="code">{v.code}</span> — Giảm{' '}
                      <b>{v.percent}%</b> tổng đơn
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        v.used
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {v.used ? 'Đã dùng' : 'Còn hiệu lực'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="field-label">Nhập mã ưu đãi mới</div>
            <div className="flex gap-2">
              <input
                className="field-input"
                id="voucherCodeInput"
                placeholder="VD: SALE15, SINHVIEN20..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                style={{ flex: 1 }}
              />
              <button
                className="mini-btn primary"
                id="redeemVoucherBtn"
                style={{ padding: '9px 18px', fontSize: '13px' }}
                onClick={handleRedeem}
              >
                Nhập mã
              </button>
            </div>

            {voucherError && (
              <div className="error-text show mt-2">{voucherError}</div>
            )}
            {voucherOk && (
              <div className="ok-text show mt-2">{voucherOk}</div>
            )}

            <div className="text-xs text-gray-500 mt-2 bg-stone-100 p-2 rounded border border-stone-200">
              💡 <b>Gợi ý mã ưu đãi có sẵn:</b> <code>SALE15</code> (Giảm 15%),{' '}
              <code>SINHVIEN20</code> (Giảm 20%), <code>GIAODICH5</code> (Giảm 5%).
            </div>
          </div>

          <div className="profile-card">
            <div className="section-title">
              Món yêu thích ({favoriteProducts.length})
            </div>

            <div id="favoriteList" className="space-y-2">
              {favoriteProducts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Chưa có món yêu thích — nhấn biểu tượng 🤍 trên các món ăn để lưu lại.
                </p>
              ) : (
                favoriteProducts.map((p) => (
                  <div key={p.id} className="fav-mini-card">
                    <div
                      className="fav-mini-img"
                      style={{ background: bgForCategory(p.cat) }}
                    >
                      {p.icon}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">
                        {money(p.price)} •{' '}
                        {p.stock === 0 ? (
                          <span className="text-red-600 font-bold">Hết hàng</span>
                        ) : (
                          `Còn ${p.stock} phần`
                        )}
                      </div>
                    </div>

                    <button
                      className="mini-btn primary"
                      disabled={p.stock === 0}
                      onClick={() => onAddToCart(p, 1, '')}
                    >
                      + Đặt ngay
                    </button>
                    <button
                      className="mini-btn danger"
                      onClick={() => onToggleFavorite(p.id)}
                    >
                      Bỏ thích
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
