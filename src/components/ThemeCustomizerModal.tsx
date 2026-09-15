import React, { useState } from 'react';
import { CardStyle, FontStyle, LayoutDensity, MenuLayout, ThemeConfig, ThemePalette } from '../types';
import { PALETTE_INFOS, THEME_PRESETS } from '../utils/theme';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onUpdateTheme: (newConfig: ThemeConfig) => void;
  onResetTheme: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onUpdateTheme,
  onResetTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'layout' | 'brand'>('palette');

  if (!isOpen) return null;

  const handlePaletteChange = (palette: ThemePalette) => {
    onUpdateTheme({ ...themeConfig, palette });
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    onUpdateTheme({ ...themeConfig, isDarkMode: isDark });
  };

  const handleCardStyleChange = (cardStyle: CardStyle) => {
    onUpdateTheme({ ...themeConfig, cardStyle });
  };

  const handleLayoutDensityChange = (layoutDensity: LayoutDensity) => {
    onUpdateTheme({ ...themeConfig, layoutDensity });
  };

  const handleMenuLayoutChange = (menuLayout: MenuLayout) => {
    onUpdateTheme({ ...themeConfig, menuLayout });
  };

  const handleFontStyleChange = (fontStyle: FontStyle) => {
    onUpdateTheme({ ...themeConfig, fontStyle });
  };

  const handleBrandChange = (key: keyof ThemeConfig['brand'], value: any) => {
    onUpdateTheme({
      ...themeConfig,
      brand: {
        ...themeConfig.brand,
        [key]: value,
      },
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onUpdateTheme({
      ...themeConfig,
      ...preset.config,
    });
  };

  const emojiIcons = ['🐾', '🍱', '☕', '🍜', '🍔', '🍰', '🍕', '🥗', '🐱', '🦊', '🍙', '🥤', '🥪', '🥟'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      id="themeCustomizerBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[8px_8px_0_#221F1A] dark:shadow-[8px_8px_0_#000] overflow-hidden"
        id="themeCustomizerContainer"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-900 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-stone-900 flex items-center justify-center text-xl shadow-[2px_2px_0_#221F1A]">
              🎨
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-display text-stone-900 dark:text-white leading-tight">
                Tùy biến & Chỉnh sửa Giao diện
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Thay đổi bảng màu, phong cách thẻ, chế độ tối & nhận diện thương hiệu tức thì
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/30 px-3 pt-2 gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'palette'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-x-2 border-stone-900 dark:border-stone-700 -mb-[1px]'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('palette')}
          >
            <span>🌈</span>
            <span>Màu sắc & Chế độ Sáng/Tối</span>
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'layout'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-x-2 border-stone-900 dark:border-stone-700 -mb-[1px]'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('layout')}
          >
            <span>📐</span>
            <span>Bố cục & Kiểu dáng thẻ</span>
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-x-2 border-stone-900 dark:border-stone-700 -mb-[1px]'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-white/50'
            }`}
            onClick={() => setActiveTab('brand')}
          >
            <span>🏪</span>
            <span>Nhận diện & Biểu ngữ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PALETTE & DARK MODE */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              {/* Quick Preset Themes */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Giao diện mẫu 1-chạm (Presets):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="p-3 text-left rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-500 bg-stone-50/70 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 transition-all group"
                      onClick={() => applyPreset(p.id)}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {p.icon}
                        </span>
                        <span>{p.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="p-4 rounded-2xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <span>{themeConfig.isDarkMode ? '🌙' : '☀️'}</span>
                    <span>Chế độ hiển thị: {themeConfig.isDarkMode ? 'Giao diện Tối (Dark Mode)' : 'Giao diện Sáng (Light Mode)'}</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Tối ưu độ tương phản và êm mắt khi sử dụng vào ban đêm
                  </p>
                </div>

                <div className="flex bg-white dark:bg-stone-900 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      !themeConfig.isDarkMode
                        ? 'bg-amber-400 text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                    onClick={() => handleDarkModeToggle(false)}
                  >
                    <span>☀️</span>
                    <span>Sáng</span>
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      themeConfig.isDarkMode
                        ? 'bg-stone-800 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleDarkModeToggle(true)}
                  >
                    <span>🌙</span>
                    <span>Tối</span>
                  </button>
                </div>
              </div>

              {/* Color Palettes Grid */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>Bảng màu chủ đạo (Color Palettes):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PALETTE_INFOS.map((pal) => {
                    const isSelected = themeConfig.palette === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        className={`p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-stone-900 dark:border-white shadow-[3px_3px_0_#221F1A] dark:shadow-[3px_3px_0_#fff] scale-[1.02]'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 bg-stone-50/50 dark:bg-stone-800/40'
                        }`}
                        onClick={() => handlePaletteChange(pal.id)}
                      >
                        {/* Swatches preview */}
                        <div className="flex gap-1.5 mb-2.5">
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300"
                            style={{ backgroundColor: pal.primary }}
                            title="Primary Accent"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300"
                            style={{ backgroundColor: pal.accent }}
                            title="Secondary Accent"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-stone-300"
                            style={{ backgroundColor: pal.bgLight }}
                            title="Light Tone"
                          />
                        </div>

                        <div>
                          <div className="font-bold text-xs text-stone-900 dark:text-white flex items-center justify-between">
                            <span>{pal.name}</span>
                            {isSelected && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {pal.badge}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAYOUT & STYLES */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Card Style Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Phong cách thẻ & Đường viền (Card Archetype):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'neo-brutalist' as CardStyle,
                      name: 'Neo-Brutalist',
                      icon: '🧱',
                      desc: 'Viền đen nổi bật, bóng đổ góc cạnh, mang phong cách ấn tượng và đậm chất đồ họa',
                    },
                    {
                      id: 'modern-soft' as CardStyle,
                      name: 'Modern Soft',
                      icon: '☁️',
                      desc: 'Bo tròn mềm mại 2xl, bóng mờ dịu mắt, chuyển màu mượt mà cao cấp chuẩn 2026',
                    },
                    {
                      id: 'sleek-minimal' as CardStyle,
                      name: 'Sleek Minimal',
                      icon: '✨',
                      desc: 'Tối giản thanh thoát, viền mảnh nhẹ nhàng, không gian mở thoáng đãng',
                    },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        themeConfig.cardStyle === style.id
                          ? 'border-stone-900 dark:border-white bg-amber-50/50 dark:bg-stone-800 shadow-[3px_3px_0_#221F1A] dark:shadow-[3px_3px_0_#fff]'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
                      }`}
                      onClick={() => handleCardStyleChange(style.id)}
                    >
                      <div className="text-xl mb-1">{style.icon}</div>
                      <div className="font-bold text-xs text-stone-900 dark:text-white">
                        {style.name}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                        {style.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Grid Layout */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Cách sắp xếp danh sách món (Menu Layout):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'grid-3' as MenuLayout, name: 'Lưới 3 cột', icon: '▦', desc: 'Rộng thoáng, ảnh to' },
                    { id: 'grid-4' as MenuLayout, name: 'Lưới 4 cột', icon: '▤', desc: 'Hiển thị nhiều món' },
                    { id: 'list' as MenuLayout, name: 'Danh sách', icon: '☰', desc: 'Xem ngang, chọn lẹ' },
                  ].map((layout) => (
                    <button
                      key={layout.id}
                      type="button"
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        themeConfig.menuLayout === layout.id
                          ? 'border-stone-900 dark:border-white bg-amber-400 text-stone-900 font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                      }`}
                      onClick={() => handleMenuLayoutChange(layout.id)}
                    >
                      <div className="text-lg">{layout.icon}</div>
                      <div className="text-xs font-bold mt-1">{layout.name}</div>
                      <div className="text-[10px] opacity-75">{layout.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Mật độ hiển thị (Density):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: 'comfortable' as LayoutDensity,
                      name: 'Thoáng đãng (Comfortable)',
                      desc: 'Khoảng cách rộng rãi, dễ bấm, tạo cảm giác thư giãn',
                    },
                    {
                      id: 'compact' as LayoutDensity,
                      name: 'Gọn gàng (Compact)',
                      desc: 'Thu nhỏ khoảng trống, xem được nhiều nội dung cùng lúc',
                    },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        themeConfig.layoutDensity === d.id
                          ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                      }`}
                      onClick={() => handleLayoutDensityChange(d.id)}
                    >
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        {d.name}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {d.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Kiểu Font chữ (Typography):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'sans' as FontStyle, name: 'Hiện đại (Sans)', sample: 'Aa Trực quan' },
                    { id: 'rounded' as FontStyle, name: 'Bo tròn (Cute)', sample: 'Aa Dễ thương' },
                    { id: 'display' as FontStyle, name: 'Cổ điển (Serif)', sample: 'Aa Sang trọng' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        themeConfig.fontStyle === f.id
                          ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
                      }`}
                      onClick={() => handleFontStyleChange(f.id)}
                    >
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic">
                        {f.sample}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING & BANNERS */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <span>💡</span>
                <span>
                  Bạn có thể đổi tên Căng tin sang tên trường hoặc cơ sở của bạn (VD: <b>Căng Tin Bách Khoa</b>, <b>Canteen KTX Khu B</b>).
                </span>
              </div>

              {/* Canteen Name & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Tên hiển thị Căng Tin:
                  </label>
                  <input
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 outline-none font-bold text-stone-900 dark:text-white"
                    value={themeConfig.brand.canteenName}
                    onChange={(e) => handleBrandChange('canteenName', e.target.value)}
                    placeholder="VD: KittyCanteen, Căng tin Sinh Viên..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Biểu tượng Logo:
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {emojiIcons.slice(0, 6).map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                          themeConfig.brand.canteenIcon === icon
                            ? 'bg-amber-400 border-stone-900 font-bold scale-110 shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
                        }`}
                        onClick={() => handleBrandChange('canteenIcon', icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  Khẩu hiệu / Phụ đề Căng Tin:
                </label>
                <input
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 outline-none text-stone-800 dark:text-stone-200"
                  value={themeConfig.brand.canteenSubtitle}
                  onChange={(e) => handleBrandChange('canteenSubtitle', e.target.value)}
                  placeholder="VD: Hệ thống Quản lý Căng tin Trường học..."
                />
              </div>

              {/* Announcement Bar Toggle & Text */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.brand.showAnnouncement}
                      onChange={(e) => handleBrandChange('showAnnouncement', e.target.checked)}
                      className="w-4 h-4 rounded text-teal-800"
                    />
                    <span>Hiển thị Thanh tin tức Căng tin (Announcement Bar)</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {themeConfig.brand.showAnnouncement ? '🟢 Đang bật' : '⚪ Đang ẩn'}
                  </span>
                </div>

                {themeConfig.brand.showAnnouncement && (
                  <input
                    className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 outline-none text-stone-800 dark:text-stone-200"
                    value={themeConfig.brand.announcementText}
                    onChange={(e) => handleBrandChange('announcementText', e.target.value)}
                    placeholder="Nội dung thông báo (VD: Đang mở cửa đón khách...)"
                  />
                )}
              </div>

              {/* Hero Banner Toggle & Titles */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.brand.showHeroBanner}
                      onChange={(e) => handleBrandChange('showHeroBanner', e.target.checked)}
                      className="w-4 h-4 rounded text-teal-800"
                    />
                    <span>Hiển thị Biểu ngữ lớn đầu trang (Hero Banner)</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {themeConfig.brand.showHeroBanner ? '🟢 Đang bật' : '⚪ Đang ẩn'}
                  </span>
                </div>

                {themeConfig.brand.showHeroBanner && (
                  <div className="space-y-2">
                    <input
                      className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 outline-none font-bold text-stone-900 dark:text-white"
                      value={themeConfig.brand.heroTitle}
                      onChange={(e) => handleBrandChange('heroTitle', e.target.value)}
                      placeholder="Tiêu đề Hero Banner..."
                    />
                    <textarea
                      rows={2}
                      className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 outline-none text-stone-700 dark:text-stone-300"
                      value={themeConfig.brand.heroSubtitle}
                      onChange={(e) => handleBrandChange('heroSubtitle', e.target.value)}
                      placeholder="Mô tả phụ cho Hero Banner..."
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-stone-900 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-red-600 flex items-center gap-1 py-2 px-3 hover:bg-stone-200/50 dark:hover:bg-stone-700/50 rounded-xl transition-all"
            onClick={onResetTheme}
          >
            <span>🔄</span>
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-stone-900 font-extrabold text-xs rounded-xl shadow-[2px_2px_0_#221F1A] transition-all flex items-center gap-1.5"
            onClick={onClose}
          >
            <span>✓</span>
            <span>Hoàn tất & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
