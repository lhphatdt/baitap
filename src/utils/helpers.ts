export const money = (n: number): string => {
  return n.toLocaleString('vi-VN') + 'đ';
};

export const bgForCategory = (cat: string): string => {
  if (cat === 'Món chính') return '#FDEBD1';
  if (cat === 'Đồ uống') return '#DCEEE1';
  return '#E4DCFD';
};

export const nowStr = (): string => {
  const d = new Date();
  return (
    d.toLocaleDateString('vi-VN') +
    ' ' +
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  );
};

export const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Chờ duyệt', cls: 'st-pending' },
  approved: { label: 'Đã duyệt', cls: 'st-approved' },
  preparing: { label: 'Đang chuẩn bị', cls: 'st-preparing' },
  ready: { label: 'Sẵn sàng nhận', cls: 'st-ready' },
  done: { label: 'Đã nhận món', cls: 'st-done' },
  cancelled: { label: 'Đã hủy', cls: 'st-cancelled' },
};
