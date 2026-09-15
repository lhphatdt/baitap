import React, { useState } from 'react';
import { Account, Order, OrderStatus, Product, Role } from '../types';
import { money, statusMap } from '../utils/helpers';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  accounts: Account[];
  currentUser: Account;
  onAddProduct: (product: Omit<Product, 'id' | 'sold'>) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateStock: (productId: number, addQty: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  onAddAccount: (account: { id: string; name: string; password: string; role: Role }) => { success: boolean; message: string };
  onChangeAccountRole: (accountId: string, newRole: Role) => void;
  onToggleLockAccount: (accountId: string) => void;
  onResetAccountPassword: (accountId: string) => void;
  onOpenReceipt?: (order: Order) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  orders,
  accounts,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onUpdateStock,
  onDeleteProduct,
  onAdvanceOrderStatus,
  onRejectOrder,
  onAddAccount,
  onChangeAccountRole,
  onToggleLockAccount,
  onResetAccountPassword,
  onOpenReceipt,
}) => {
  const [subTab, setSubTab] = useState<'products' | 'ordersAdmin' | 'accounts' | 'report'>('products');

  // New product form
  const [npName, setNpName] = useState('');
  const [npCat, setNpCat] = useState('Món chính');
  const [npPrice, setNpPrice] = useState<number | ''>('');
  const [npStock, setNpStock] = useState<number | ''>('');
  const [npIcon, setNpIcon] = useState('🍱');
  const [npImage, setNpImage] = useState('');
  const [npDesc, setNpDesc] = useState('');

  // Editing product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Reject order modal or inline reason
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // New account form
  const [naName, setNaName] = useState('');
  const [naId, setNaId] = useState('');
  const [naPass, setNaPass] = useState('');
  const [naRole, setNaRole] = useState<Role>('staff');
  const [accountMsg, setAccountMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isEditing && editingProduct) {
            setEditingProduct({ ...editingProduct, image: reader.result });
          } else {
            setNpImage(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!npName.trim() || !npPrice) return;
    onAddProduct({
      name: npName.trim(),
      cat: npCat,
      price: Number(npPrice),
      stock: Number(npStock) || 0,
      icon: npIcon.trim() || '🍽️',
      image: npImage.trim() || undefined,
      desc: npDesc.trim() || 'Món ăn thơm ngon, nóng hổi tại căng tin.',
    });
    setNpName('');
    setNpPrice('');
    setNpStock('');
    setNpImage('');
    setNpDesc('');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(null);
    if (!naName.trim() || !naId.trim() || naPass.length < 6) {
      setAccountMsg({
        text: 'Vui lòng nhập đầy đủ họ tên, mã đăng nhập và mật khẩu (≥6 ký tự)',
        isError: true,
      });
      return;
    }
    const res = onAddAccount({
      id: naId.trim(),
      name: naName.trim(),
      password: naPass,
      role: naRole,
    });
    setAccountMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setNaName('');
      setNaId('');
      setNaPass('');
      setTimeout(() => setAccountMsg(null), 3000);
    }
  };

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending: 'approved',
    approved: 'preparing',
    preparing: 'ready',
    ready: 'done',
    done: null,
    cancelled: null,
  };

  // Report statistics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const avg = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const weights = [0.12, 0.14, 0.11, 0.16, 0.22, 0.15, 0.10];
  const maxW = Math.max(...weights);

  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const sampleFoodImages = [
    { label: 'Cơm / Món mặn', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80' },
    { label: 'Bún / Mì / Phở', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80' },
    { label: 'Trà sữa / Đồ ngọt', url: 'https://images.unsplash.com/photo-1558857563-b37cf5c47952?w=500&auto=format&fit=crop&q=80' },
    { label: 'Cà phê / Trà', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80' },
    { label: 'Đồ ăn vặt chiên', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="view-container" id="view-admin">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-2">
          <span>⚙️</span> Trang quản trị toàn quyền căng tin (Admin)
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Dành riêng cho Quản lý & Chủ căng tin. Thiết lập thực đơn, định giá, tải ảnh món ăn, phân quyền nhân sự và xem báo cáo tài chính.
        </p>
      </div>

      <div className="subtabs" id="admin-subtabs">
        <button
          className={`subtab-btn ${subTab === 'products' ? 'active' : ''}`}
          onClick={() => setSubTab('products')}
        >
          🍲 Quản lý Thực đơn & Hình ảnh
        </button>
        <button
          className={`subtab-btn ${subTab === 'ordersAdmin' ? 'active' : ''}`}
          onClick={() => setSubTab('ordersAdmin')}
        >
          📋 Tổng duyệt Đơn hàng ({orders.length})
        </button>
        <button
          className={`subtab-btn ${subTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setSubTab('accounts')}
        >
          👥 Quản trị Tài khoản & Phân quyền
        </button>
        <button
          className={`subtab-btn ${subTab === 'report' ? 'active' : ''}`}
          onClick={() => setSubTab('report')}
        >
          📊 Báo cáo Tài chính Doanh thu
        </button>
      </div>

      {/* SUBTAB 1: PRODUCTS */}
      {subTab === 'products' && (
        <div>
          <form onSubmit={handleCreateProduct}>
            <div className="section-title">Thêm món ăn / Đồ uống mới kèm hình ảnh</div>
            <div className="form-grid">
              <div>
                <label>Tên món ăn</label>
                <input
                  className="field-input"
                  id="npName"
                  placeholder="VD: Cơm sườn xào chua ngọt"
                  value={npName}
                  onChange={(e) => setNpName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Danh mục</label>
                <select
                  className="field-input"
                  id="npCat"
                  value={npCat}
                  onChange={(e) => setNpCat(e.target.value)}
                >
                  <option value="Món chính">Món chính</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Đồ ăn nhẹ">Đồ ăn nhẹ</option>
                </select>
              </div>
              <div>
                <label>Đơn giá bán (VNĐ)</label>
                <input
                  className="field-input"
                  type="number"
                  id="npPrice"
                  placeholder="30000"
                  value={npPrice}
                  onChange={(e) => setNpPrice(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              </div>
              <div>
                <label>Số lượng tồn kho ban đầu</label>
                <input
                  className="field-input"
                  type="number"
                  id="npStock"
                  placeholder="20"
                  value={npStock}
                  onChange={(e) => setNpStock(e.target.value ? Number(e.target.value) : '')}
                />
              </div>

              {/* Image upload and preview */}
              <div className="full bg-stone-50 border border-stone-200 rounded-xl p-4">
                <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">
                  Hình ảnh món ăn (Tải từ máy tính hoặc dán liên kết)
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-20 h-20 rounded-xl border-2 border-black bg-white flex items-center justify-center text-3xl overflow-hidden shadow-sm flex-shrink-0">
                    {npImage ? (
                      <img src={npImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      npIcon
                    )}
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="mini-btn primary inline-block cursor-pointer">
                      📁 Tải ảnh từ máy tính
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProductImageUpload(e, false)}
                      />
                    </label>

                    <div className="flex gap-2">
                      <input
                        className="field-input text-xs"
                        placeholder="Hoặc dán link ảnh (https://...)"
                        value={npImage}
                        onChange={(e) => setNpImage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <span className="font-bold">Ảnh mẫu nhanh: </span>
                  {sampleFoodImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      className="underline mr-2 text-teal-800 hover:text-teal-950"
                      onClick={() => setNpImage(s.url)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Biểu tượng (Emoji)</label>
                <input
                  className="field-input"
                  id="npIcon"
                  placeholder="🍲"
                  value={npIcon}
                  onChange={(e) => setNpIcon(e.target.value)}
                />
              </div>
              <div>
                <label>Mô tả món ăn</label>
                <input
                  className="field-input"
                  id="npDesc"
                  placeholder="Mô tả nguyên liệu, hương vị..."
                  value={npDesc}
                  onChange={(e) => setNpDesc(e.target.value)}
                />
              </div>
              <div className="full">
                <button
                  type="submit"
                  className="mini-btn primary"
                  id="addProductBtn"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  + Lưu & Thêm món vào thực đơn
                </button>
              </div>
            </div>
          </form>

          <div className="section-title mt-6">
            Danh sách thực đơn căng tin ({products.length} món)
          </div>
          <div className="overflow-x-auto">
            <table id="adminProductTable">
              <thead>
                <tr>
                  <th>Hình ảnh & Tên món</th>
                  <th>Danh mục</th>
                  <th>Đơn giá</th>
                  <th>Tồn kho</th>
                  <th>Đã bán</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-black overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center text-xl">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            p.icon
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{p.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.cat}</td>
                    <td className="font-bold">{money(p.price)}</td>
                    <td>
                      {p.stock === 0 ? (
                        <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded text-xs">
                          Hết hàng (0)
                        </span>
                      ) : (
                        <span className="font-semibold">{p.stock} phần</span>
                      )}
                    </td>
                    <td>{p.sold}</td>
                    <td>
                      <button
                        className="mini-btn"
                        onClick={() => setEditingProduct(p)}
                        title="Chỉnh sửa hình ảnh và thông tin món"
                      >
                        ✏️ Sửa ảnh / Giá
                      </button>
                      <button
                        className="mini-btn"
                        onClick={() => onUpdateStock(p.id, 5)}
                        title="Bổ sung thêm 5 phần vào kho"
                      >
                        +5 Tồn kho
                      </button>
                      <button
                        className="mini-btn danger"
                        onClick={() => onDeleteProduct(p.id)}
                        title="Xóa món ăn"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL EDIT PRODUCT */}
      {editingProduct && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
        >
          <div className="modal p-6 max-w-lg">
            <button className="close-x" onClick={() => setEditingProduct(null)}>
              ✕
            </button>
            <h2 className="text-xl font-bold font-display mb-3">
              Chỉnh sửa món ăn: {editingProduct.name}
            </h2>

            <form onSubmit={handleSaveEditProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">Tên món</label>
                <input
                  className="field-input"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase">Đơn giá (đ)</label>
                  <input
                    className="field-input"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase">Tồn kho</label>
                  <input
                    className="field-input"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              {/* Image Editor */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">
                  Hình ảnh món ăn
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border border-black overflow-hidden bg-white flex-shrink-0 flex items-center justify-center text-2xl">
                    {editingProduct.image ? (
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      editingProduct.icon
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="mini-btn primary inline-block cursor-pointer text-xs">
                      📁 Chọn ảnh mới từ máy tính
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProductImageUpload(e, true)}
                      />
                    </label>
                    <input
                      className="field-input text-xs"
                      placeholder="Hoặc dán URL ảnh..."
                      value={editingProduct.image || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, image: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">Mô tả chi tiết</label>
                <textarea
                  className="field-input h-20"
                  value={editingProduct.desc}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, desc: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="mini-btn"
                  onClick={() => setEditingProduct(null)}
                >
                  Hủy
                </button>
                <button type="submit" className="mini-btn primary">
                  ✓ Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ORDERS ADMIN */}
      {subTab === 'ordersAdmin' && (
        <div>
          <div className="section-title">
            Danh sách điều phối đơn hàng ({orders.length})
          </div>
          <div className="overflow-x-auto">
            <table id="adminOrderTable">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thời gian & Vị trí</th>
                  <th>Món đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác điều phối</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const st = statusMap[o.status] || { label: o.status, cls: 'st-pending' };
                  const nxt = nextStatus[o.status];

                  return (
                    <tr key={o.id}>
                      <td className="font-bold font-display text-sm">#{o.id}</td>
                      <td>
                        <div className="font-semibold">{o.customerName}</div>
                        <div className="text-xs text-gray-500">Mã: {o.accountId}</div>
                      </td>
                      <td>
                        <div className="text-xs text-gray-700">{o.createdAt}</div>
                        <div className="text-xs text-teal-800 font-medium">{o.addr}</div>
                      </td>
                      <td>
                        <div className="text-xs space-y-0.5">
                          {o.items.map((i, idx) => (
                            <div key={idx}>
                              {i.name} × <b>{i.qty}</b>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="font-bold text-sm">
                        {money(o.total)}
                        <div className="text-xs text-gray-500 font-normal">
                          {o.pay === 'QR' ? '💳 QR Pay' : '💵 Tiền mặt'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${st.cls}`}>{st.label}</span>
                        {o.cancelReason && (
                          <div className="text-xs text-red-600 mt-1 max-w-[150px]">
                            Lý do: {o.cancelReason}
                          </div>
                        )}
                      </td>
                      <td className="space-y-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          {onOpenReceipt && (
                            <button
                              type="button"
                              className="mini-btn bg-white hover:bg-stone-100 text-stone-800"
                              onClick={() => onOpenReceipt(o)}
                              title="In phiếu nhận món"
                            >
                              🖨️ Phiếu
                            </button>
                          )}
                          {nxt && (
                            <button
                              className="mini-btn primary"
                              onClick={() => onAdvanceOrderStatus(o.id)}
                            >
                              Chuyển: {statusMap[nxt].label} ➔
                            </button>
                          )}
                        </div>

                        {o.status === 'pending' && (
                          <button
                            className="mini-btn danger"
                            onClick={() => {
                              setRejectId(o.id);
                              setRejectReason('');
                            }}
                          >
                            Từ chối
                          </button>
                        )}

                        {rejectId === o.id && (
                          <div className="reason-box active mt-2">
                            <input
                              placeholder="Nhập lý do từ chối đơn..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <button
                              className="mini-btn danger"
                              onClick={() => {
                                onRejectOrder(o.id, rejectReason || 'Căng tin hết nguyên liệu tạm thời');
                                setRejectId(null);
                              }}
                            >
                              Xác nhận hủy
                            </button>
                            <button
                              className="mini-btn"
                              onClick={() => setRejectId(null)}
                            >
                              Đóng
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ACCOUNTS */}
      {subTab === 'accounts' && (
        <div>
          <form onSubmit={handleCreateAccount}>
            <div className="section-title">Cấp tài khoản nhân viên / Quản trị viên</div>
            <div className="form-grid">
              <div>
                <label>Họ và tên</label>
                <input
                  className="field-input"
                  id="naName"
                  placeholder="Nguyễn Văn Nhân Viên"
                  value={naName}
                  onChange={(e) => setNaName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Mã / Số điện thoại đăng nhập</label>
                <input
                  className="field-input"
                  id="naId"
                  placeholder="VD: NV002 hoặc 09xxxx"
                  value={naId}
                  onChange={(e) => setNaId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Mật khẩu khởi tạo (≥ 6 ký tự)</label>
                <input
                  className="field-input"
                  type="password"
                  id="naPass"
                  placeholder="Mật khẩu ban đầu"
                  value={naPass}
                  onChange={(e) => setNaPass(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Phân quyền truy cập</label>
                <select
                  className="field-input"
                  id="naRole"
                  value={naRole}
                  onChange={(e) => setNaRole(e.target.value as Role)}
                >
                  <option value="staff">Nhân viên Bếp / Phục vụ (Staff)</option>
                  <option value="admin">Quản trị viên toàn quyền (Admin)</option>
                  <option value="customer">Khách hàng / Sinh viên (Customer)</option>
                </select>
              </div>

              {accountMsg && (
                <div
                  className={`full text-sm font-semibold ${
                    accountMsg.isError ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {accountMsg.text}
                </div>
              )}

              <div className="full">
                <button
                  type="submit"
                  className="mini-btn primary"
                  id="addAccountBtn"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  + Cấp tài khoản mới
                </button>
              </div>
            </div>
          </form>

          <div className="section-title mt-6">
            Danh sách tài khoản trên hệ thống ({accounts.length})
          </div>
          <div className="overflow-x-auto">
            <table id="adminAccountTable">
              <thead>
                <tr>
                  <th>Avatar & Mã</th>
                  <th>Họ tên</th>
                  <th>Phân quyền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => {
                  const isCurrent = a.id === currentUser.id;
                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-black overflow-hidden bg-stone-100 flex items-center justify-center text-xs">
                            {a.avatar ? (
                              <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                            ) : a.role === 'customer' ? (
                              '🎓'
                            ) : a.role === 'staff' ? (
                              '🍳'
                            ) : (
                              '🛠️'
                            )}
                          </div>
                          <span className="font-semibold text-xs">{a.id}</span>
                        </div>
                      </td>
                      <td className="text-xs font-medium">{a.name}</td>
                      <td>
                        <select
                          className="field-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={a.role}
                          disabled={isCurrent}
                          onChange={(e) => onChangeAccountRole(a.id, e.target.value as Role)}
                        >
                          <option value="customer">Người dùng (Customer)</option>
                          <option value="staff">Nhân viên Bếp (Staff)</option>
                          <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                      </td>
                      <td>
                        {a.locked ? (
                          <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded text-xs">
                            Đã bị khóa
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">
                            Đang hoạt động
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="mini-btn"
                          disabled={isCurrent}
                          onClick={() => onToggleLockAccount(a.id)}
                          title={a.locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {a.locked ? '🔓 Mở khóa' : '🔒 Khóa'}
                        </button>
                        <button
                          className="mini-btn"
                          onClick={() => onResetAccountPassword(a.id)}
                          title="Đặt lại mật khẩu về mặc định: 123456"
                        >
                          🔑 Đặt lại MK
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: REPORT */}
      {subTab === 'report' && (
        <div>
          <div className="stat-grid" id="statGrid">
            <div className="stat-card">
              <div className="num">{money(totalRevenue)}</div>
              <div className="lbl">Tổng doanh thu thực nhận</div>
            </div>
            <div className="stat-card">
              <div className="num">{totalOrders}</div>
              <div className="lbl">Tổng lượt đơn hàng</div>
            </div>
            <div className="stat-card">
              <div className="num text-amber-700">{pendingCount}</div>
              <div className="lbl">Đơn đang chờ tiếp nhận</div>
            </div>
            <div className="stat-card">
              <div className="num">{money(avg)}</div>
              <div className="lbl">Giá trị trung bình / Đơn</div>
            </div>
          </div>

          <div className="section-title">Biểu đồ doanh thu 7 ngày gần nhất</div>
          <div className="bar-chart" id="barChart">
            {days.map((d, i) => {
              const hPercent = (weights[i] / maxW) * 100;
              const estRev = Math.round(totalRevenue * weights[i]);
              return (
                <div key={d} className="bar-col">
                  <div
                    className="bar"
                    style={{ height: `${Math.max(10, hPercent)}%` }}
                    title={`${d}: ~${money(estRev)}`}
                  />
                  <div className="bar-lbl">{d}</div>
                </div>
              );
            })}
          </div>

          <div className="section-title mt-8">
            Top 5 món bán chạy nhất căn tin
          </div>
          <div className="overflow-x-auto">
            <table id="topItemsTable">
              <thead>
                <tr>
                  <th>Món ăn / Thức uống</th>
                  <th>Danh mục</th>
                  <th>Số phần đã bán</th>
                  <th>Ước tính doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-black overflow-hidden flex items-center justify-center bg-white text-base flex-shrink-0">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            p.icon
                          )}
                        </div>
                        <span className="font-semibold text-xs">{p.name}</span>
                      </div>
                    </td>
                    <td>{p.cat}</td>
                    <td className="font-bold text-teal-800">{p.sold} phần</td>
                    <td className="font-bold">{money(p.sold * p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
