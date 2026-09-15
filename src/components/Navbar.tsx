import React, { useState } from 'react';
import { Account, CanteenBrandConfig } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  currentUser: Account | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  brand: CanteenBrandConfig;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenThemeCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  currentUser,
  onLogout,
  onOpenAuth,
  brand,
  isDarkMode,
  onToggleDarkMode,
  onOpenThemeCustomizer,
}) => {
  const [soundActive, setSoundActive] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundActive(sound.enabled);
    if (sound.enabled) {
      sound.playKitchenCall();
    }
  };

  const roleLabel: Record<string, string> = {
    customer: 'Sinh viên',
    staff: 'Nhân viên Bếp',
    admin: 'Quản lý',
  };

  return (
    <header className="topbar bg-[#F4F2EC] dark:bg-stone-900 border-b-2 border-stone-900 dark:border-stone-800 px-4 sm:px-6 py-3 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-3 shadow-xs" id="app-topbar">
      {/* Brand Logo & Name (Customizable) */}
      <div
        className="brand flex items-center gap-2.5 cursor-pointer group"
        id="app-brand"
        onClick={() => onSelectTab('menu')}
      >
        <div className="brand-mark w-10 h-10 rounded-full bg-amber-400 border-2 border-stone-900 flex items-center justify-center text-xl shadow-[2px_2px_0_#221F1A] transition-transform group-hover:scale-105" id="brand-avatar">
          {brand.canteenIcon || '🐾'}
        </div>
        <div>
          <div className="brand-name font-display font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-white leading-tight flex items-center gap-2">
            <span>{brand.canteenName || 'KittyCanteen'}</span>
          </div>
          <div className="brand-sub text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            {brand.canteenSubtitle || 'Hệ thống Quản lý Căng tin Trường học'}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav className="tabs bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-full p-1 shadow-[2px_2px_0_#221F1A] dark:shadow-none flex items-center gap-1 flex-wrap" id="mainTabs" aria-label="Main Navigation">
        <button
          id="nav-tab-menu"
          className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'menu'
              ? 'bg-stone-900 text-white shadow-xs dark:bg-amber-400 dark:text-stone-900'
              : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
          }`}
          onClick={() => onSelectTab('menu')}
        >
          🍽️ Thực đơn
        </button>

        <button
          id="nav-tab-cart"
          className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all relative ${
            currentTab === 'cart'
              ? 'bg-stone-900 text-white shadow-xs dark:bg-amber-400 dark:text-stone-900'
              : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
          }`}
          onClick={() => onSelectTab('cart')}
        >
          🛒 Giỏ hàng
          {cartCount > 0 && (
            <span className="badge ml-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold" id="cartBadge">
              {cartCount}
            </span>
          )}
        </button>

        <button
          id="nav-tab-orders"
          className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'orders'
              ? 'bg-stone-900 text-white shadow-xs dark:bg-amber-400 dark:text-stone-900'
              : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
          }`}
          onClick={() => onSelectTab('orders')}
        >
          📦 Đơn của tôi
        </button>

        <button
          id="nav-tab-queue"
          className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'queue'
              ? 'bg-stone-900 text-white shadow-xs dark:bg-amber-400 dark:text-stone-900'
              : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
          }`}
          onClick={() => onSelectTab('queue')}
        >
          📢 Gọi số quầy
        </button>

        {currentUser && (
          <button
            id="nav-tab-profile"
            className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              currentTab === 'profile'
                ? 'bg-stone-900 text-white shadow-xs dark:bg-amber-400 dark:text-stone-900'
                : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
            onClick={() => onSelectTab('profile')}
          >
            👤 Hồ sơ
          </button>
        )}

        {currentUser?.role === 'staff' && (
          <button
            id="nav-tab-staff"
            className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              currentTab === 'staff'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-teal-900 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-200'
            }`}
            onClick={() => onSelectTab('staff')}
          >
            🍳 Bếp & Chuẩn bị
          </button>
        )}

        {currentUser?.role === 'admin' && (
          <button
            id="nav-tab-admin"
            className={`tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              currentTab === 'admin'
                ? 'bg-red-800 text-white shadow-xs'
                : 'text-red-800 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:text-red-200'
            }`}
            onClick={() => onSelectTab('admin')}
          >
            ⚙️ Quản trị Căng tin
          </button>
        )}
      </nav>

      {/* Auth & Utility Area */}
      <div id="authArea" className="flex items-center gap-2">
        {/* Theme Customizer Trigger Button */}
        <button
          type="button"
          id="themeCustomizerBtn"
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-600 text-xs font-black shadow-[2px_2px_0_#221F1A] dark:shadow-none transition-all flex items-center gap-1.5 group cursor-pointer"
          title="Chỉnh sửa giao diện, màu sắc & bố cục"
          onClick={onOpenThemeCustomizer}
        >
          <span className="group-hover:rotate-12 transition-transform text-sm">🎨</span>
          <span className="hidden sm:inline">Tùy biến</span>
        </button>

        {/* Quick Dark/Light mode toggle */}
        <button
          type="button"
          id="quickDarkModeBtn"
          className="w-9 h-9 rounded-full bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-600 flex items-center justify-center text-sm shadow-[2px_2px_0_#221F1A] dark:shadow-none hover:bg-stone-100 dark:hover:bg-stone-700 transition-all cursor-pointer"
          title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-600 flex items-center justify-center text-sm shadow-[2px_2px_0_#221F1A] dark:shadow-none hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
          title={soundActive ? 'Đang bật âm thanh thông báo' : 'Đang tắt âm thanh'}
          onClick={toggleSound}
        >
          {soundActive ? '🔔' : '🔕'}
        </button>

        {!currentUser ? (
          <button
            className="login-cta px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold text-xs rounded-xl border-2 border-stone-900 shadow-[2px_2px_0_#221F1A] transition-all"
            id="openLoginBtn"
            onClick={onOpenAuth}
          >
            Đăng nhập / Đăng ký
          </button>
        ) : (
          <div className="user-chip flex items-center gap-2 bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-2.5 py-1.5 shadow-[2px_2px_0_#221F1A] dark:shadow-none" id="user-chip-container">
            {/* Coins badge if student */}
            {currentUser.coins !== undefined && (
              <div
                className="hidden sm:flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700 text-[11px] font-bold cursor-pointer"
                title="Số dư Xu tích lũy (Dùng để giảm giá hóa đơn)"
                onClick={() => onSelectTab('profile')}
              >
                <span>🪙</span>
                <span>{currentUser.coins.toLocaleString('vi-VN')} Xu</span>
              </div>
            )}

            <div
              className="user-avatar w-7 h-7 rounded-full overflow-hidden border border-stone-400 flex items-center justify-center text-sm bg-stone-100 cursor-pointer"
              id="user-avatar-badge"
              onClick={() => onSelectTab('profile')}
              title="Nhấn để xem Hồ sơ"
            >
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

            <div className="text-left hidden md:block">
              <div
                className="text-xs font-bold text-stone-900 dark:text-white cursor-pointer hover:underline"
                onClick={() => onSelectTab('profile')}
              >
                {currentUser.name.split('(')[0].trim()}
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                    : currentUser.role === 'staff'
                    ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
                id="user-role-badge"
              >
                {roleLabel[currentUser.role]}
              </span>
            </div>

            <button
              className="logout-btn text-stone-400 hover:text-red-600 font-bold text-xs p-1"
              id="logoutBtn"
              title="Đăng xuất"
              onClick={onLogout}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
