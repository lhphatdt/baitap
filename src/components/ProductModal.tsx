import React, { useState, useEffect } from 'react';
import { Account, Product } from '../types';
import { bgForCategory, money } from '../utils/helpers';
import { sound } from '../utils/sound';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  currentUser: Account | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number, note: string) => void;
  onAddReview?: (productId: number, rating: number, comment: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  currentUser,
  onClose,
  onAddToCart,
  onAddReview,
  isFavorite,
  onToggleFavorite,
}) => {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (product) {
      setQty(1);
      setNote('');
      setShowReviewForm(false);
      setNewRating(5);
      setNewComment('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleMinus = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handlePlus = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  const handleAdd = () => {
    if (product.stock === 0) return;
    sound.playAddToCart();
    onAddToCart(product, qty, note.trim());
    onClose();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (onAddReview) {
      onAddReview(product.id, newRating, newComment.trim());
      setNewComment('');
      setShowReviewForm(false);
    }
  };

  const reviews = product.reviews || [];

  return (
    <div
      className="overlay"
      id="productOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal modal-wrap max-w-2xl max-h-[92vh] overflow-y-auto" id="productModalDialog">
        <button
          className="close-x"
          id="closeModal"
          onClick={onClose}
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* Modal Image Header */}
        <div
          className="modal-img relative overflow-hidden"
          id="modalImg"
          style={{ background: bgForCategory(product.cat) }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            product.icon
          )}
          <span className="absolute bottom-3 left-3 bg-white/95 text-2xl px-2.5 py-1 rounded-xl shadow-md border border-stone-200">
            {product.icon}
          </span>
          {product.isHotDeal && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
              🔥 Best Seller
            </span>
          )}
        </div>

        <div className="modal-body p-6 text-left">
          {/* Category & Favorite Button */}
          <div className="flex items-center justify-between">
            <div className="pcard-cat" id="modalCat">
              {product.cat}
            </div>
            <button
              className="fav-btn"
              id="modalFavBtn"
              style={{ position: 'static' }}
              title={isFavorite ? 'Bỏ thích' : 'Lưu vào yêu thích'}
              onClick={() => onToggleFavorite(product.id)}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Product Name */}
          <h2 id="modalName" className="font-display font-bold text-2xl text-stone-900 mt-1 mb-2">
            {product.name}
          </h2>

          {/* Key Quick Badges (Prep Time, Calories, Rating) */}
          <div className="flex items-center gap-2 flex-wrap mb-3 text-xs font-semibold">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
              ⭐ {product.rating || 4.9} ({product.reviewsCount || reviews.length} đánh giá)
            </span>
            <span className="bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              ⏱️ {product.prepTime || '5-7 phút'}
            </span>
            {product.calories && (
              <span className="bg-stone-100 text-stone-700 border border-stone-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                🔥 {product.calories} kcal
              </span>
            )}
            {product.spicyLevel !== undefined && product.spicyLevel > 0 && (
              <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                {product.spicyLevel === 1 ? '🌶️ Cay nhẹ' : '🌶️🌶️ Cay nồng'}
              </span>
            )}
            <span className="text-stone-500 font-normal">
              Đã bán: <b>{product.sold}</b> phần
            </span>
          </div>

          {/* Price */}
          <div className="price text-2xl text-teal-900 font-extrabold mb-3" id="modalPrice">
            {money(product.price)}
          </div>

          {/* Description */}
          <p className="modal-desc text-stone-700 text-sm leading-relaxed mb-4" id="modalDesc">
            {product.desc}
          </p>

          {/* Quantity & Stock */}
          <div className="qty-row bg-stone-50 p-3 rounded-xl border border-stone-200 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700 uppercase">Số lượng:</span>
              <div className="qty-ctrl">
                <button
                  id="qtyMinus"
                  onClick={handleMinus}
                  disabled={qty <= 1}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <span id="qtyVal" className="font-bold font-mono px-2">
                  {qty}
                </span>
                <button
                  id="qtyPlus"
                  onClick={handlePlus}
                  disabled={qty >= product.stock}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                product.stock > 0
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}
              id="modalStock"
            >
              {product.stock > 0 ? `Còn ${product.stock} suất sẵn sàng` : 'Tạm hết món'}
            </span>
          </div>

          {/* Note input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Ghi chú riêng cho đầu bếp:
            </label>
            <input
              className="note-input w-full text-xs"
              id="modalNote"
              placeholder="VD: Không hành lá, ít đường ít đá, nhiều nước sốt..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Add to cart CTA */}
          <button
            className="full-btn !py-3 text-sm font-bold bg-teal-800 hover:bg-teal-900 text-white rounded-xl shadow-[3px_3px_0_#221F1A] transition-all flex items-center justify-center gap-2"
            id="modalAddBtn"
            disabled={product.stock === 0}
            onClick={handleAdd}
          >
            <span>🛒</span>
            <span>
              {product.stock === 0
                ? 'Hiện tại đã hết hàng'
                : `Thêm vào giỏ đặt món • ${money(product.price * qty)}`}
            </span>
          </button>

          {/* Customer Reviews & Feedback Section */}
          <div className="mt-6 pt-5 border-t-2 border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  💬 Đánh giá từ sinh viên ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500">Cảm nhận thực tế của các bạn sinh viên sau khi dùng món</p>
              </div>
              <button
                type="button"
                className="mini-btn text-xs font-bold bg-white hover:bg-stone-100 border-stone-300"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Hủy viết' : '✍️ Viết nhận xét'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-stone-50 border border-stone-300 rounded-xl p-3.5 mb-4 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700">
                    Người đánh giá: <b>{currentUser ? currentUser.name : 'Khách vãng lai'}</b>
                  </span>
                  {/* Rating Stars picker */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`text-lg transition-transform hover:scale-125 ${
                          star <= newRating ? 'text-amber-500' : 'text-stone-300'
                        }`}
                        onClick={() => setNewRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="field-input text-xs w-full mb-2 bg-white"
                  rows={2}
                  placeholder="Chia sẻ cảm nhận về hương vị, độ tươi ngon, khẩu phần..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="mini-btn primary text-xs font-bold !py-1.5"
                >
                  Gửi đánh giá ngay
                </button>
              </form>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <div className="text-center py-4 text-xs text-stone-400 italic">
                Chưa có nhận xét nào. Hãy là người đầu tiên thưởng thức và chấm điểm món ăn này nhé!
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">{r.authorName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">
                          {'★'.repeat(r.rating)}
                        </span>
                        <span className="text-[10px] text-stone-400">{r.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
