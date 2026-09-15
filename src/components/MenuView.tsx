import React, { useState } from 'react';
import { CanteenBrandConfig, MenuLayout, Product } from '../types';
import { bgForCategory, money } from '../utils/helpers';
import { sound } from '../utils/sound';

interface MenuViewProps {
  products: Product[];
  categories: string[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenProductModal: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  brand: CanteenBrandConfig;
  menuLayout: MenuLayout;
  onChangeMenuLayout: (layout: MenuLayout) => void;
  onOpenThemeCustomizer: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  categories,
  currentCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onOpenProductModal,
  onQuickAdd,
  onToggleFavorite,
  isFavorite,
  brand,
  menuLayout,
  onChangeMenuLayout,
  onOpenThemeCustomizer,
}) => {
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'fastest'>('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  // Filter products
  let filteredProducts = products.filter((p) => {
    const matchCat = currentCategory === 'Tất cả' || p.cat === currentCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStock = !onlyInStock || p.stock > 0;
    const matchPrice = maxPriceFilter === null || p.price <= maxPriceFilter;
    return matchCat && matchSearch && matchStock && matchPrice;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'fastest') {
      const getMin = (t: string) => parseInt(t.replace(/[^0-9]/g, ''), 10) || 10;
      return getMin(a.prepTime || '') - getMin(b.prepTime || '');
    }
    // Default popular
    return b.sold - a.sold;
  });

  const handleQuickAddClick = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    sound.playAddToCart();
    onQuickAdd(p);
  };

  const gridClass =
    menuLayout === 'grid-4'
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
      : menuLayout === 'list'
      ? 'flex flex-col gap-3.5'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-5" id="view-menu">
      {/* Live Campus Announcement Bar (Customizable) */}
      {brand.showAnnouncement && (
        <div className="bg-stone-900 dark:bg-stone-800 text-stone-100 text-xs py-2.5 px-4 rounded-xl mb-6 shadow-sm border border-stone-800 dark:border-stone-700 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
              Trạng thái Căng Tin:
            </span>
            <span className="text-stone-300">
              {brand.announcementText || '🟢 Đang mở cửa đón khách • Nấu nóng trực tiếp tại quầy Bếp Tầng 1'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-[11px]">
            <span>⏱️ Cao điểm: 11:30 - 12:30</span>
            <span>🪙 Tích 5% Canteen Coin</span>
            <button
              type="button"
              className="text-amber-300 hover:underline flex items-center gap-1 font-bold"
              onClick={onOpenThemeCustomizer}
            >
              <span>🎨 Tùy biến giao diện</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section (Customizable) */}
      {brand.showHeroBanner && (
        <div className="hero bg-[#EAE5D9] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-6 sm:p-8 mb-6 shadow-[4px_4px_0_#221F1A] dark:shadow-none relative overflow-hidden" id="menu-hero-section">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-amber-400 dark:border-amber-700">
              <span>{brand.canteenIcon || '✨'}</span>
              <span>{brand.heroBadge || 'Thực đơn nóng hổi mỗi ngày cho Giảng viên & Sinh viên'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-stone-900 dark:text-white tracking-tight leading-tight mb-3">
              {brand.heroTitle || 'Đói bụng giữa giờ? Đặt trước qua app, tới quầy lấy ngay!'}
            </h1>
            <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed mb-5">
              {brand.heroSubtitle ||
                'Không lo xếp hàng dài chờ đợi giờ cao điểm. Đặt món nóng sốt, nhận thông báo khi hoàn thành và thanh toán chuyển khoản VietQR 24/7 tiện lợi.'}
            </p>

            {/* Quick Value Highlights */}
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 shadow-2xs">
                <span>🚀</span>
                <span>Lên món nhanh 3 - 7 phút</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 shadow-2xs">
                <span>🪙</span>
                <span>Tích Xu giảm tiền mặt mọi đơn</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 shadow-2xs">
                <span>🥗</span>
                <span>Chứng nhận ATTP & Nguồn gốc rõ ràng</span>
              </div>
            </div>
          </div>

          {/* Decorative Badge Graphic */}
          <div className="absolute right-4 -bottom-6 hidden lg:flex items-center justify-center opacity-90 pointer-events-none select-none">
            <span className="text-[120px] drop-shadow-md">{brand.canteenIcon || '🍱'}</span>
          </div>
        </div>
      )}

      {/* Main Search & Category Toolbar */}
      <div className="toolbar bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-4 sm:p-5 mb-6 shadow-[3px_3px_0_#221F1A] dark:shadow-none space-y-4" id="menu-toolbar">
        {/* Search Bar, Sorter & Layout Switcher */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="search-box flex-1 flex items-center bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-2xl px-3.5 py-2.5" id="search-box-container">
            <span aria-hidden="true" className="text-base mr-2">🔍</span>
            <input
              id="searchInput"
              className="bg-transparent w-full text-xs sm:text-sm outline-none placeholder:text-stone-400 text-stone-900 dark:text-white font-medium"
              placeholder="Tìm cơm gà xối mỡ, bún bò huế, trà đào cam sả, bánh mì..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 border-none bg-transparent px-1.5 font-bold"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown & Layout Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Layout Mode Switcher */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
              <button
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  menuLayout === 'grid-3'
                    ? 'bg-amber-400 text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                title="Hiển thị lưới 3 cột"
                onClick={() => onChangeMenuLayout('grid-3')}
              >
                <span>▦</span>
                <span className="hidden sm:inline">3 Cột</span>
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  menuLayout === 'grid-4'
                    ? 'bg-amber-400 text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                title="Hiển thị lưới 4 cột"
                onClick={() => onChangeMenuLayout('grid-4')}
              >
                <span>▤</span>
                <span className="hidden sm:inline">4 Cột</span>
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  menuLayout === 'list'
                    ? 'bg-amber-400 text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                title="Hiển thị dạng Danh sách"
                onClick={() => onChangeMenuLayout('list')}
              >
                <span>☰</span>
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>

            {/* Sorter */}
            <div className="flex items-center gap-1.5">
              <select
                id="sortBySelect"
                className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 outline-none cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="popular">🔥 Bán chạy</option>
                <option value="rating">⭐ Đánh giá cao</option>
                <option value="fastest">⏱️ Chế biến nhanh</option>
                <option value="price-asc">💵 Giá tăng</option>
                <option value="price-desc">💰 Giá giảm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories and Fast Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
          {/* Categories */}
          <div id="catChips" className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-chip-${cat}`}
                className={`chip px-3.5 py-1.5 text-xs font-bold rounded-full transition-all border ${
                  cat === currentCategory
                    ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-900 border-stone-900 dark:border-amber-400 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-200'
                }`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Fast Toggle Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                onlyInStock
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50'
              }`}
              onClick={() => setOnlyInStock(!onlyInStock)}
            >
              🟢 Chỉ món còn hàng
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                maxPriceFilter === 25000
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50'
              }`}
              onClick={() => setMaxPriceFilter(maxPriceFilter === 25000 ? null : 25000)}
            >
              💸 Giá ≤ 25.000đ
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-12 text-center shadow-[4px_4px_0_#221F1A] dark:shadow-none" id="menu-empty-state">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="font-bold text-lg text-stone-900 dark:text-white">Không tìm thấy món ăn phù hợp</p>
          <p className="text-xs sm:text-sm mt-1 text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Thử tìm kiếm với từ khóa khác, tắt bộ lọc giá hoặc chọn lại danh mục "Tất cả".
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-stone-900 dark:bg-amber-400 dark:text-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800"
            onClick={() => {
              onSearchChange('');
              onSelectCategory('Tất cả');
              setOnlyInStock(false);
              setMaxPriceFilter(null);
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : menuLayout === 'list' ? (
        /* HORIZONTAL LIST VIEW MODE */
        <div className="flex flex-col gap-3.5" id="productList">
          {filteredProducts.map((p) => {
            const fav = isFavorite(p.id);
            return (
              <div
                key={p.id}
                className="pcard group bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl overflow-hidden shadow-[3px_3px_0_#221F1A] dark:shadow-none hover:translate-y-[-1px] transition-all cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-4 gap-4"
                id={`product-list-card-${p.id}`}
                onClick={() => onOpenProductModal(p)}
              >
                {/* Left Thumbnail & Badges */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 relative shrink-0"
                    style={{ background: bgForCategory(p.cat) }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {p.icon}
                      </div>
                    )}
                    {p.isHotDeal && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                        ⭐ {p.rating || 4.8}
                      </span>
                      <span>⏱️ {p.prepTime || '5-7p'}</span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {p.cat}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </div>

                {/* Right Actions & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                  <div className="text-left sm:text-right">
                    <div className="price text-base sm:text-lg font-extrabold text-teal-900 dark:text-amber-400">
                      {money(p.price)}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Đã bán: {p.sold} suất
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`fav-btn-list-${p.id}`}
                      className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:scale-110 flex items-center justify-center text-xs transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p.id);
                      }}
                      title={fav ? 'Bỏ thích' : 'Yêu thích'}
                    >
                      {fav ? '❤️' : '🤍'}
                    </button>

                    {p.stock === 0 ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-xl">
                        Tạm hết
                      </span>
                    ) : (
                      <button
                        id={`quick-add-btn-list-${p.id}`}
                        className="text-xs font-bold px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0_#221F1A] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1"
                        onClick={(e) => handleQuickAddClick(e, p)}
                      >
                        <span>+</span>
                        <span>Chọn món</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW MODE (3 OR 4 COLUMNS) */
        <div className={gridClass} id="productGrid">
          {filteredProducts.map((p) => {
            const fav = isFavorite(p.id);
            return (
              <div
                key={p.id}
                className="pcard group bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl overflow-hidden shadow-[4px_4px_0_#221F1A] dark:shadow-none hover:translate-y-[-3px] transition-all cursor-pointer flex flex-col justify-between"
                id={`product-card-${p.id}`}
                onClick={() => onOpenProductModal(p)}
              >
                {/* Product Card Top Image */}
                <div
                  className="pcard-img relative h-48 w-full overflow-hidden border-b-2 border-stone-900 dark:border-stone-700"
                  style={{ background: bgForCategory(p.cat) }}
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {p.icon}
                    </div>
                  )}

                  {/* Icon & Category Floating Badge */}
                  <span className="absolute bottom-2.5 left-2.5 bg-white/95 dark:bg-stone-900/95 text-xs font-bold text-stone-900 dark:text-stone-100 px-2.5 py-1 rounded-lg shadow-xs border border-stone-200 dark:border-stone-700 flex items-center gap-1">
                    <span>{p.icon}</span>
                    <span>{p.cat}</span>
                  </span>

                  {/* Hot Deal / Best Seller Tag */}
                  {p.isHotDeal && (
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                      🔥 Best Seller
                    </span>
                  )}

                  {/* Favorite Toggle Button */}
                  <button
                    id={`fav-btn-${p.id}`}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-sm shadow-xs transition-transform hover:scale-110"
                    title={fav ? 'Bỏ thích' : 'Lưu vào món yêu thích'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(p.id);
                    }}
                  >
                    {fav ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Product Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating, Prep Time & Calories Row */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex-wrap">
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                        ⭐ {p.rating || 4.8}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400">
                        ⏱️ {p.prepTime || '5-7p'}
                      </span>
                      {p.calories && (
                        <span className="text-stone-400">
                          • {p.calories} kcal
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-display font-bold text-base text-stone-900 dark:text-white line-clamp-1 mb-1 group-hover:text-amber-600 transition-colors">
                      {p.name}
                    </h3>

                    {/* Product Short Description */}
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
                      {p.desc}
                    </p>
                  </div>

                  {/* Card Footer: Price & Add Button */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <span className="price text-base sm:text-lg font-extrabold text-teal-900 dark:text-amber-400">
                        {money(p.price)}
                      </span>
                      <div className="text-[10px] text-stone-400">
                        Đã bán: {p.sold}
                      </div>
                    </div>

                    {p.stock === 0 ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-2.5 py-1.5 rounded-xl">
                        Tạm hết
                      </span>
                    ) : (
                      <button
                        id={`quick-add-btn-${p.id}`}
                        className="add-btn text-xs font-bold px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0_#221F1A] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1"
                        onClick={(e) => handleQuickAddClick(e, p)}
                      >
                        <span>+</span>
                        <span>Thêm</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
