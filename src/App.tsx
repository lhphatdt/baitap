import { useState, useEffect } from 'react';
import { Account, CartItem, Order, OrderStatus, Product, Role, ThemeConfig } from './types';
import {
  CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  VALID_VOUCHER_CODES,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { MenuView } from './components/MenuView';
import { ProductModal } from './components/ProductModal';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { StaffWorkstationView } from './components/StaffWorkstationView';
import { QueueBoardView } from './components/QueueBoardView';
import { AuthModalView } from './components/AuthView';
import { QRModal } from './components/QRModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { Toast } from './components/Toast';
import { sound } from './utils/sound';
import { nowStr } from './utils/helpers';
import { applyThemeToDom, DEFAULT_THEME_CONFIG } from './utils/theme';

export default function App() {
  // Theme & Appearance configuration state
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('kc_theme_config');
    return saved ? JSON.parse(saved) : DEFAULT_THEME_CONFIG;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Accounts state
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('kc_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Current logged in user (defaults to student account for demo preview)
  const [currentUser, setCurrentUser] = useState<Account | null>(() => {
    const saved = localStorage.getItem('kc_current_user');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS[0];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Navigation state
  const [currentTab, setCurrentTab] = useState<string>('menu');
  const [currentCategory, setCurrentCategory] = useState<string>('Tất cả');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Receipt Slip Modal
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // VietQR NAPAS Modal
  const [qrModalInfo, setQrModalInfo] = useState<{ isOpen: boolean; orderId: string; amount: number }>({
    isOpen: false,
    orderId: '',
    amount: 0,
  });

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('kc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kc_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('kc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kc_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kc_cart', JSON.stringify(cart));
  }, [cart]);

  // Apply and persist Theme Configuration
  useEffect(() => {
    localStorage.setItem('kc_theme_config', JSON.stringify(themeConfig));
    applyThemeToDom(themeConfig);
    if (themeConfig.brand?.canteenName) {
      document.title = `${themeConfig.brand.canteenName} - Hệ thống Quản lý Căng tin`;
    }
  }, [themeConfig]);

  const handleToggleDarkMode = () => {
    setThemeConfig((prev) => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }));
    showToast(themeConfig.isDarkMode ? '☀️ Đã chuyển sang giao diện Sáng' : '🌙 Đã chuyển sang giao diện Tối');
  };

  const handleSaveThemeConfig = (updated: ThemeConfig) => {
    setThemeConfig(updated);
    showToast('✨ Đã lưu cài đặt giao diện thành công!');
  };

  // Tab switching with role protection
  const handleSelectTab = (tab: string) => {
    const authRequiredTabs = ['cart', 'orders', 'profile'];
    if (authRequiredTabs.includes(tab) && !currentUser) {
      showToast('Vui lòng đăng nhập để tiếp tục');
      setIsAuthModalOpen(true);
      return;
    }
    if (tab === 'admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        showToast('Chỉ tài khoản Quản trị viên (Admin) mới có quyền vào mục này');
        return;
      }
    }
    if (tab === 'staff') {
      if (!currentUser || (currentUser.role !== 'staff' && currentUser.role !== 'admin')) {
        showToast('Chỉ nhân viên Bếp / Quầy mới có quyền vào mục này');
        return;
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Favorites logic
  const isFavorite = (productId: number) => {
    return !!(currentUser?.favorites && currentUser.favorites.includes(productId));
  };

  const handleToggleFavorite = (productId: number) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để lưu món yêu thích');
      setIsAuthModalOpen(true);
      return;
    }

    const currentFavs = currentUser.favorites || [];
    const nextFavs = currentFavs.includes(productId)
      ? currentFavs.filter((id) => id !== productId)
      : [...currentFavs, productId];

    const updatedUser = { ...currentUser, favorites: nextFavs };
    setCurrentUser(updatedUser);
    setAccounts((prev) =>
      prev.map((a) => (a.id === currentUser.id ? updatedUser : a))
    );
    showToast(
      nextFavs.includes(productId)
        ? 'Đã thêm món vào danh sách Yêu thích ❤️'
        : 'Đã bỏ món khỏi Yêu thích'
    );
  };

  // Cart operations
  const handleAddToCart = (product: Product, qty = 1, note = '') => {
    if (product.stock <= 0) {
      showToast(`Món "${product.name}" hiện đang tạm hết suất.`);
      return;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === product.id && c.note === note);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].qty = Math.min(product.stock, next[existingIdx].qty + qty);
        return next;
      }
      return [...prev, { id: product.id, qty, note }];
    });

    sound.playAddCart();
    showToast(`Đã thêm ${qty} phần "${product.name}" vào giỏ!`);
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Đã xóa món khỏi giỏ hàng');
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    setCart((prev) => {
      const next = [...prev];
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index].qty = newQty;
      return next;
    });
  };

  // Checkout with Canteen Coins deduction
  const handleCheckout = (
    addr: string,
    phone: string,
    payMethod: 'Tiền mặt' | 'QR',
    voucherCode: string | null,
    coinsUsed = 0
  ) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để hoàn tất đặt món');
      setIsAuthModalOpen(true);
      return;
    }

    if (!addr || !phone) {
      showToast('Vui lòng điền địa chỉ nhận món và số điện thoại liên hệ');
      return;
    }

    // Check stock
    for (const c of cart) {
      const p = products.find((prod) => prod.id === c.id);
      if (!p || c.qty > p.stock) {
        showToast(`Món "${p?.name || 'Sản phẩm'}" hiện không đủ tồn kho`);
        return;
      }
    }

    const subtotal = cart.reduce((acc, c) => {
      const p = products.find((prod) => prod.id === c.id);
      return acc + (p ? p.price * c.qty : 0);
    }, 0);

    let discountAmount = 0;
    let usedVoucherCode: string | null = null;

    if (voucherCode) {
      const v = currentUser.vouchers?.find((item) => item.code === voucherCode && !item.used);
      if (v) {
        discountAmount = Math.round((subtotal * v.percent) / 100);
        usedVoucherCode = v.code;
      }
    }

    const afterVoucher = Math.max(0, subtotal - discountAmount);
    const actualCoinsUsed = Math.min(currentUser.coins || 0, Math.min(coinsUsed, afterVoucher));
    const finalTotal = Math.max(0, afterVoucher - actualCoinsUsed);

    // Deduct user coins and mark voucher as used
    const updatedCoins = Math.max(0, (currentUser.coins || 0) - actualCoinsUsed);
    const updatedVouchers = currentUser.vouchers.map((item) =>
      item.code === usedVoucherCode ? { ...item, used: true } : item
    );
    const updatedUser = { ...currentUser, coins: updatedCoins, vouchers: updatedVouchers };
    setCurrentUser(updatedUser);
    setAccounts((prev) =>
      prev.map((a) => (a.id === currentUser.id ? updatedUser : a))
    );

    // Deduct stock and increment sold count
    setProducts((prev) =>
      prev.map((p) => {
        const inCart = cart.find((c) => c.id === p.id);
        if (inCart) {
          return {
            ...p,
            stock: Math.max(0, p.stock - inCart.qty),
            sold: p.sold + inCart.qty,
          };
        }
        return p;
      })
    );

    // Create new order
    const orderNum = orders.length + 1;
    const newOrderId = `DH${String(orderNum).padStart(3, '0')}`;
    const orderItems = cart.map((c) => {
      const p = products.find((prod) => prod.id === c.id)!;
      return {
        name: p.name,
        qty: c.qty,
        price: p.price,
        note: c.note,
      };
    });

    const newOrder: Order = {
      id: newOrderId,
      accountId: currentUser.id,
      customerName: currentUser.name,
      items: orderItems,
      total: finalTotal,
      voucher: usedVoucherCode,
      coinsUsed: actualCoinsUsed > 0 ? actualCoinsUsed : undefined,
      status: 'pending',
      pay: payMethod,
      createdAt: nowStr(),
      addr,
      estimatedWaitMinutes: 5 + Math.min(15, cart.length * 2),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    sound.playOrderPlaced();

    if (payMethod === 'QR') {
      setQrModalInfo({
        isOpen: true,
        orderId: newOrderId,
        amount: finalTotal,
      });
    } else {
      showToast(`Đặt hàng thành công! Mã đơn #${newOrderId} đã chuyển vào Bếp.`);
      setCurrentTab('orders');
    }
  };

  // Auth operations
  const handleLogin = (id: string, pass: string) => {
    const acc = accounts.find((a) => a.id.toLowerCase() === id.toLowerCase());
    if (!acc) {
      return { success: false, message: 'Mã tài khoản không tồn tại trên hệ thống.' };
    }

    if (acc.password !== pass) {
      return { success: false, message: 'Mã tài khoản hoặc mật khẩu không chính xác.' };
    }
    if (acc.locked) {
      return { success: false, message: 'Tài khoản này đang bị khóa. Vui lòng liên hệ ban quản lý.' };
    }

    setCurrentUser(acc);
    setIsAuthModalOpen(false);
    showToast(`Đăng nhập thành công! Chào mừng ${acc.name}`);
    if (acc.role === 'admin') {
      setCurrentTab('admin');
    } else if (acc.role === 'staff') {
      setCurrentTab('staff');
    } else {
      setCurrentTab('menu');
    }
    return { success: true, message: 'Đăng nhập thành công', account: acc };
  };

  const handleRegister = (name: string, id: string, pass: string) => {
    if (accounts.some((a) => a.id.toLowerCase() === id.toLowerCase())) {
      return { success: false, message: 'Mã số hoặc số điện thoại này đã tồn tại.' };
    }

    const newAccount: Account = {
      id,
      name,
      password: pass,
      role: 'customer',
      locked: false,
      phone: id.startsWith('0') ? id : '',
      address: '',
      coins: 10000, // Welcome gift of 10.000 Xu
      favorites: [],
      vouchers: [{ code: 'WELCOME10', percent: 10, used: false }],
    };

    setAccounts((prev) => [...prev, newAccount]);
    setCurrentUser(newAccount);
    setIsAuthModalOpen(false);
    showToast(`Đăng ký thành công! Bạn nhận được 10.000 Xu Kitty Canteen chào mừng 🎉`);
    setCurrentTab('menu');
    return { success: true, message: 'Đăng ký thành công', account: newAccount };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    showToast('Đã đăng xuất tài khoản thành công.');
    setCurrentTab('menu');
  };

  // Profile operations
  const handleUpdateProfileInfo = (name: string, phone: string, address: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, phone, address };
    setCurrentUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? updated : a)));
    showToast('Đã cập nhật thông tin cá nhân');
  };

  const handleUpdateAvatar = (avatarUrl: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, avatar: avatarUrl };
    setCurrentUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? updated : a)));
    showToast('Đã cập nhật ảnh đại diện mới thành công! 📸');
  };

  const handleUpdatePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Chưa đăng nhập' };
    if (currentUser.password !== oldPass) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
    }
    const updated = { ...currentUser, password: newPass };
    setCurrentUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? updated : a)));
    showToast('Đã cập nhật mật khẩu mới thành công!');
    return { success: true, message: 'Đổi mật khẩu thành công' };
  };

  const handleRedeemVoucher = (code: string) => {
    if (!currentUser) return { success: false, message: 'Chưa đăng nhập' };
    const upper = code.toUpperCase();
    if (currentUser.vouchers.some((v) => v.code === upper)) {
      return { success: false, message: 'Bạn đã có mã giảm giá này trong ví rồi.' };
    }
    const percent = VALID_VOUCHER_CODES[upper];
    if (!percent) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }

    const newVoucher = { code: upper, percent, used: false };
    const updated = { ...currentUser, vouchers: [...currentUser.vouchers, newVoucher] };
    setCurrentUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? updated : a)));
    showToast(`Đã nhận mã ${upper} (Giảm ${percent}%) thành công!`);
    return { success: true, message: `Thêm mã ${upper} giảm ${percent}% thành công!` };
  };

  // Product reviews
  const handleAddReview = (productId: number, rating: number, comment: string) => {
    const author = currentUser ? currentUser.name : 'Sinh viên';
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: author,
      rating,
      comment,
      date: 'Hôm nay',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const reviews = [...(p.reviews || []), newRev];
          const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          return {
            ...p,
            reviews,
            rating: Number(avg.toFixed(1)),
          };
        }
        return p;
      })
    );
    showToast('Cảm ơn bạn đã gửi đánh giá món ăn!');
  };

  // Staff & Admin order operations
  const handleAdvanceOrderStatus = (orderId: string) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
      pending: 'approved',
      approved: 'preparing',
      preparing: 'ready',
      ready: 'done',
      done: null,
      cancelled: null,
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const next = nextStatusMap[o.status];
          if (next) {
            // Sound triggers
            if (next === 'ready') {
              sound.playKitchenCall();
            } else if (next === 'done') {
              sound.playSuccess();
              // Award 5% loyalty coins to customer
              const earnedCoins = Math.round(o.total * 0.05);
              if (earnedCoins > 0) {
                setAccounts((accList) =>
                  accList.map((acc) => {
                    if (acc.id === o.accountId) {
                      const newCoins = (acc.coins || 0) + earnedCoins;
                      if (currentUser?.id === acc.id) {
                        setCurrentUser({ ...currentUser, coins: newCoins });
                      }
                      return { ...acc, coins: newCoins };
                    }
                    return acc;
                  })
                );
              }
            }

            showToast(`Đơn #${o.id} đã chuyển trạng thái: ${next.toUpperCase()}`);
            return { ...o, status: next };
          }
        }
        return o;
      })
    );
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Restock items
    setProducts((prev) =>
      prev.map((p) => {
        const item = targetOrder.items.find((i) => i.name === p.name);
        if (item) {
          return {
            ...p,
            stock: p.stock + item.qty,
            sold: Math.max(0, p.sold - item.qty),
          };
        }
        return p;
      })
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled', cancelReason: reason } : o
      )
    );

    showToast(`Đã từ chối đơn #${orderId}`);
  };

  // Product Management
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'sold'>) => {
    const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const item: Product = { ...newProd, id: nextId, sold: 0 };
    setProducts((prev) => [item, ...prev]);
    showToast(`Đã thêm món "${item.name}" vào thực đơn!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    showToast(`Đã cập nhật món "${updatedProd.name}"`);
  };

  const handleUpdateStock = (productId: number, addQty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + addQty } : p))
    );
    showToast(`Đã bổ sung +${addQty} phần vào kho`);
  };

  const handleSetOutOfStock = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: 0 } : p))
    );
    showToast('Đã tạm thời báo hết món này!');
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Đã xóa món khỏi thực đơn');
  };

  // Account Management (Admin)
  const handleAddAccount = (accData: {
    id: string;
    name: string;
    password: string;
    role: Role;
  }) => {
    if (accounts.some((a) => a.id.toLowerCase() === accData.id.toLowerCase())) {
      return { success: false, message: 'Mã tài khoản này đã tồn tại trên hệ thống.' };
    }
    const newAcc: Account = {
      ...accData,
      locked: false,
      phone: '',
      address: '',
      coins: 0,
      favorites: [],
      vouchers: [],
    };
    setAccounts((prev) => [...prev, newAcc]);
    showToast(`Đã cấp tài khoản thành công cho ${accData.name}`);
    return { success: true, message: `Cấp tài khoản (${accData.role}) thành công!` };
  };

  const handleChangeAccountRole = (accountId: string, newRole: Role) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, role: newRole } : a))
    );
    if (currentUser?.id === accountId) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
    showToast(`Đã đổi phân quyền cho tài khoản ${accountId} thành ${newRole}`);
  };

  const handleToggleLockAccount = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === accountId) {
          const nextLock = !a.locked;
          showToast(nextLock ? `Đã khóa tài khoản ${a.name}` : `Đã mở khóa tài khoản ${a.name}`);
          return { ...a, locked: nextLock };
        }
        return a;
      })
    );
  };

  const handleResetAccountPassword = (accountId: string) => {
    const defaultPass = '123456';
    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, password: defaultPass } : a))
    );
    showToast(`Đã đặt lại mật khẩu cho tài khoản ${accountId} về "123456"`);
  };

  // Receipt Printer trigger
  const handleOpenReceipt = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--paper,#F8F7F4)] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-16 transition-colors duration-200">
      {/* Topbar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        cartCount={cart.reduce((sum, c) => sum + c.qty, 0)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        brand={themeConfig.brand}
        isDarkMode={themeConfig.isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenThemeCustomizer={() => setIsThemeModalOpen(true)}
      />

      {/* Main App Content Views */}
      <main className="w-full">
        {currentTab === 'menu' && (
          <MenuView
            products={products}
            categories={CATEGORIES}
            currentCategory={currentCategory}
            searchTerm={searchTerm}
            onSelectCategory={setCurrentCategory}
            onSearchChange={setSearchTerm}
            onOpenProductModal={(p) => {
              setSelectedProduct(p);
              setIsProductModalOpen(true);
            }}
            onAddToCart={(p) => handleAddToCart(p, 1, '')}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            brand={themeConfig.brand}
            menuLayout={themeConfig.menuLayout}
            onChangeMenuLayout={(layout) => setThemeConfig((prev) => ({ ...prev, menuLayout: layout }))}
            onOpenThemeCustomizer={() => setIsThemeModalOpen(true)}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            products={products}
            currentUser={currentUser}
            onRemoveItem={handleRemoveCartItem}
            onUpdateQty={handleUpdateCartQty}
            onCheckout={handleCheckout}
            onGoToMenu={() => setCurrentTab('menu')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders.filter((o) => (currentUser ? o.accountId === currentUser.id : true))}
            onCancelOrder={handleRejectOrder}
            onGoToMenu={() => setCurrentTab('menu')}
            onOpenReceipt={handleOpenReceipt}
            onOpenQR={(orderId, amount) => {
              setQrModalInfo({ isOpen: true, orderId, amount });
            }}
          />
        )}

        {currentTab === 'queue' && (
          <QueueBoardView orders={orders} />
        )}

        {currentTab === 'profile' && currentUser && (
          <ProfileView
            currentUser={currentUser}
            products={products}
            onUpdateInfo={handleUpdateProfileInfo}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdatePassword={handleUpdatePassword}
            onRedeemVoucher={handleRedeemVoucher}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'staff' && currentUser && (
          <StaffWorkstationView
            orders={orders}
            products={products}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onRejectOrder={handleRejectOrder}
            onUpdateStock={handleUpdateStock}
            onSetOutOfStock={handleSetOutOfStock}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {currentTab === 'admin' && currentUser && (
          <AdminView
            products={products}
            orders={orders}
            accounts={accounts}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onUpdateStock={handleUpdateStock}
            onDeleteProduct={handleDeleteProduct}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onRejectOrder={handleRejectOrder}
            onAddAccount={handleAddAccount}
            onChangeAccountRole={handleChangeAccountRole}
            onToggleLockAccount={handleToggleLockAccount}
            onResetAccountPassword={handleResetAccountPassword}
            onOpenReceipt={handleOpenReceipt}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div
          className="overlay"
          id="authModalOverlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="modal relative max-w-md p-2">
            <button
              className="close-x"
              onClick={() => setIsAuthModalOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
            <AuthModalView
              onLogin={handleLogin}
              onRegister={handleRegister}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Dynamic VietQR Modal */}
      <QRModal
        isOpen={qrModalInfo.isOpen}
        orderId={qrModalInfo.orderId}
        amount={qrModalInfo.amount}
        onConfirm={() => {
          const oId = qrModalInfo.orderId;
          setQrModalInfo({ isOpen: false, orderId: '', amount: 0 });
          setOrders((prev) =>
            prev.map((o) => (o.id === oId ? { ...o, status: 'approved' } : o))
          );
          sound.playSuccess();
          showToast(`⚡ VietQR NAPAS 24/7 khớp lệnh thành công! Đơn #${oId} đã chuyển vào Bếp.`);
          setCurrentTab('orders');
        }}
        onClose={() => {
          setQrModalInfo({ isOpen: false, orderId: '', amount: 0 });
          setCurrentTab('orders');
        }}
      />

      {/* Thermal Slip Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* Theme & UI Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        themeConfig={themeConfig}
        onSaveTheme={handleSaveThemeConfig}
      />

      {/* Toast Alert */}
      <Toast message={toastMessage} />
    </div>
  );
}
