import { ThemeConfig, ThemePalette } from '../types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  palette: 'warm',
  isDarkMode: false,
  cardStyle: 'neo-brutalist',
  layoutDensity: 'comfortable',
  menuLayout: 'grid-3',
  fontStyle: 'sans',
  brand: {
    canteenName: 'KittyCanteen',
    canteenSubtitle: 'Hệ thống Quản lý Căng tin Trường học',
    canteenIcon: '🐾',
    canteenHotline: '0901.234.567',
    canteenAddress: 'Tầng 1 - Khu B Căng tin Sinh viên',
    announcementText: '🟢 Đang mở cửa đón khách • Nấu nóng trực tiếp tại quầy Bếp Tầng 1',
    showAnnouncement: true,
    showHeroBanner: true,
    heroTitle: 'Đói bụng giữa giờ? Đặt trước qua app, tới quầy lấy ngay!',
    heroSubtitle:
      'Không lo xếp hàng dài chờ đợi giờ cao điểm. Đặt món nóng sốt, nhận thông báo khi hoàn thành và thanh toán chuyển khoản VietQR 24/7 tiện lợi.',
    heroBadge: '✨ Thực đơn nóng hổi mỗi ngày cho Giảng viên & Sinh viên',
  },
};

export interface PaletteInfo {
  id: ThemePalette;
  name: string;
  badge: string;
  primary: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  surfaceLight: string;
  surfaceDark: string;
}

export const PALETTE_INFOS: PaletteInfo[] = [
  {
    id: 'warm',
    name: 'Ấm Áp Cà Phê',
    badge: '☕ Latte & Bánh Mì',
    primary: '#F0A93A', // mustard
    accent: '#0E4F52', // teal
    bgLight: '#F4F2EC',
    bgDark: '#1C1917',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#292524',
  },
  {
    id: 'matcha',
    name: 'Matcha Zen',
    badge: '🍵 Trà Xanh Dịu Mắt',
    primary: '#10B981', // emerald
    accent: '#065F46', // deep green
    bgLight: '#F0FDF4',
    bgDark: '#064E3B',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#022C22',
  },
  {
    id: 'ocean',
    name: 'Đại Dương Xanh',
    badge: '🌊 Bistro Hải Đảo',
    primary: '#0284C7', // sky
    accent: '#0F172A', // slate navy
    bgLight: '#F0F9FF',
    bgDark: '#0B132B',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#1C2541',
  },
  {
    id: 'pastel',
    name: 'Ngọt Ngào Pastel',
    badge: '🌸 Tiệm Bánh Kem',
    primary: '#F43F5E', // rose
    accent: '#881337', // deep rose
    bgLight: '#FFF1F2',
    bgDark: '#2C1318',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#4A1D24',
  },
  {
    id: 'cyber',
    name: 'Cyber Neon',
    badge: '⚡ Đêm Hiện Đại',
    primary: '#8B5CF6', // purple violet
    accent: '#06B6D4', // cyan
    bgLight: '#F5F3FF',
    bgDark: '#0F172A',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#1E293B',
  },
  {
    id: 'classic',
    name: 'Học Đường Classic',
    badge: '🏛️ Oxford & Thư Viện',
    primary: '#475569', // slate
    accent: '#1E293B',
    bgLight: '#F8FAFC',
    bgDark: '#0F172A',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#1E293B',
  },
];

export interface ThemePreset {
  id: string;
  name: string;
  icon: string;
  desc: string;
  config: Partial<ThemeConfig>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cozy-vintage',
    name: 'Căng Tin Ấm Áp Cổ Điển',
    icon: '🥖',
    desc: 'Viền đậm cá tính, tông vàng mật ong ấm áp gần gũi như quán cà phê thân quen',
    config: {
      palette: 'warm',
      isDarkMode: false,
      cardStyle: 'neo-brutalist',
      menuLayout: 'grid-3',
      fontStyle: 'sans',
      layoutDensity: 'comfortable',
    },
  },
  {
    id: 'modern-matcha',
    name: 'Zen Bistro Trà Xanh',
    icon: '🍵',
    desc: 'Bo tròn mềm mại, tông xanh matcha mát lành, bóng đổ mịn màng chuẩn phong cách Nhật',
    config: {
      palette: 'matcha',
      isDarkMode: false,
      cardStyle: 'modern-soft',
      menuLayout: 'grid-3',
      fontStyle: 'rounded',
      layoutDensity: 'comfortable',
    },
  },
  {
    id: 'midnight-snack',
    name: 'Căng Tin Đêm (Dark Mode)',
    icon: '🌙',
    desc: 'Giao diện tối êm mắt với điểm nhấn màu sắc rực rỡ, lý tưởng khi xem thực đơn vào ban đêm',
    config: {
      palette: 'cyber',
      isDarkMode: true,
      cardStyle: 'modern-soft',
      menuLayout: 'grid-4',
      fontStyle: 'sans',
      layoutDensity: 'compact',
    },
  },
  {
    id: 'sweet-bakery',
    name: 'Tiệm Trà Bánh Ngọt Ngào',
    icon: '🍰',
    desc: 'Tông hồng pastel dịu dàng, font chữ bo tròn dễ thương, tạo cảm giác thư thái tươi trẻ',
    config: {
      palette: 'pastel',
      isDarkMode: false,
      cardStyle: 'modern-soft',
      menuLayout: 'grid-3',
      fontStyle: 'rounded',
      layoutDensity: 'comfortable',
    },
  },
  {
    id: 'fast-campus',
    name: 'Quầy Nhanh Siêu Tốc (Gọn)',
    icon: '⚡',
    desc: 'Bố cục dạng danh sách ngang nhỏ gọn, tối ưu tốc độ bấm chọn món cho giờ giải lao vội vã',
    config: {
      palette: 'ocean',
      isDarkMode: false,
      cardStyle: 'sleek-minimal',
      menuLayout: 'list',
      fontStyle: 'sans',
      layoutDensity: 'compact',
    },
  },
];

/**
 * Apply theme configuration directly to document elements
 */
export function applyThemeToDom(theme: ThemeConfig) {
  const root = document.documentElement;

  // Set data attributes
  root.setAttribute('data-theme', theme.palette);
  root.setAttribute('data-card-style', theme.cardStyle);
  root.setAttribute('data-density', theme.layoutDensity);
  root.setAttribute('data-font', theme.fontStyle);

  // Set dark mode class
  if (theme.isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update dynamic CSS variables based on palette
  const palette = PALETTE_INFOS.find((p) => p.id === theme.palette) || PALETTE_INFOS[0];
  const bg = theme.isDarkMode ? palette.bgDark : palette.bgLight;
  const ink = theme.isDarkMode ? '#F5F5F4' : '#221F1A';
  const card = theme.isDarkMode ? palette.surfaceDark : palette.surfaceLight;
  const border = theme.isDarkMode ? 'rgba(255,255,255,0.15)' : '#221F1A';

  root.style.setProperty('--paper', bg);
  root.style.setProperty('--ink', ink);
  root.style.setProperty('--mustard', palette.primary);
  root.style.setProperty('--card', card);
  root.style.setProperty('--line', theme.isDarkMode ? 'rgba(255,255,255,0.12)' : '#DAD5C8');
  root.style.setProperty('--theme-primary', palette.primary);
  root.style.setProperty('--theme-accent', palette.accent);
  root.style.setProperty('--theme-border', border);
}
