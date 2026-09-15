export type Role = 'customer' | 'staff' | 'admin';

export type OrderStatus = 'pending' | 'approved' | 'preparing' | 'ready' | 'done' | 'cancelled';

export interface Voucher {
  code: string;
  percent: number;
  used: boolean;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  password: string;
  role: Role;
  locked: boolean;
  phone: string;
  address: string;
  avatar?: string;
  coins: number; // Điểm thưởng Canteen Coins (1 Xu = 1 VNĐ)
  favorites: number[];
  vouchers: Voucher[];
}

export interface Product {
  id: number;
  name: string;
  cat: string;
  price: number;
  stock: number;
  icon: string;
  image?: string;
  desc: string;
  sold: number;
  rating: number;
  reviewsCount: number;
  prepTime: string; // VD: "5-7 phút"
  calories?: number; // VD: 450
  spicyLevel?: number; // 0: Không cay, 1: Cay nhẹ, 2: Cay nồng
  isHotDeal?: boolean;
  reviews?: ReviewItem[];
}

export interface CartItem {
  id: number;
  qty: number;
  note: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  note?: string;
}

export interface Order {
  id: string;
  accountId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  voucher?: string | null;
  coinsUsed?: number;
  status: OrderStatus;
  pay: 'Tiền mặt' | 'QR';
  createdAt: string;
  addr: string;
  estimatedWaitMinutes?: number;
  cancelReason?: string;
}

export type ThemePalette = 'warm' | 'matcha' | 'ocean' | 'pastel' | 'cyber' | 'classic';
export type CardStyle = 'neo-brutalist' | 'modern-soft' | 'sleek-minimal';
export type LayoutDensity = 'comfortable' | 'compact';
export type MenuLayout = 'grid-3' | 'grid-4' | 'list';
export type FontStyle = 'sans' | 'display' | 'rounded';

export interface CanteenBrandConfig {
  canteenName: string;
  canteenSubtitle: string;
  canteenIcon: string;
  canteenHotline: string;
  canteenAddress: string;
  announcementText: string;
  showAnnouncement: boolean;
  showHeroBanner: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
}

export interface ThemeConfig {
  palette: ThemePalette;
  isDarkMode: boolean;
  cardStyle: CardStyle;
  layoutDensity: LayoutDensity;
  menuLayout: MenuLayout;
  fontStyle: FontStyle;
  brand: CanteenBrandConfig;
}
