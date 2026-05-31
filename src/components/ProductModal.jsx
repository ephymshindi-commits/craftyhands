// src/components/ProductModal.jsx
import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';

export default function ProductModal({
  product, onClose, onAddToCart,
  isWished, onToggleWishlist,
  reviews, onAddReview,
}) {
  const [selectedSize, setSelectedSize]   = useState(null);
  const [activeTab,    setActiveTab]      = useState('details');
  const [reviewForm,   setReviewForm]     = useState({ name:'', rating:5, comment:'' });
  const [notifyEmail,  setNotifyEmail]    = useState('');
  const [notifySent,   setNotifySent]     = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const inStock = product?.inStock !== false;

  useEffect(() => {
    setSelectedSize(null);
    setActiveTab('details');
    setReviewForm({ name:'', rating:5, comment:'' });
    setNotifySent(false);
    setSelectedColor(null);
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  function handleAdd() {
    if (!inStock) return;
    if (product.sizes.length > 1 && !selectedSize) return;
    onAddToCart(product, selectedSize || product.sizes[0]);
    onClose();
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    onAddReview?.(product.id, reviewForm);
    setReviewForm({ name:'', rating:5, comment:'' });
  }

  function handleNotify(e) {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifySent(true);
  }

  const avgRating = reviews?.length
    ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        {/* ── LEFT: image ── */}
        <div className={styles.imgSide}>
          {product.imgSrc ? (
            <img src={product.imgSrc} alt={product.name} className={styles.mainImg} />
          ) : (
            <div className={styles.imgPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={{fontSize:'0.72rem',color:'#B4B2A9'}}>Photo coming soon</p>
            </div>
          )}
          {!inStock && <div className={styles.soldOut}>Sold Out</div>}
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── RIGHT: info ── */}
        <div className={styles.info}>
          {/* Header */}
          <div className={styles.productHeader}>
            <div>
              <div className={styles.cat}>{product.category}</div>
              <h2 className={styles.name}>{product.name}</h2>
            </div>
            <button
              className={`${styles.wishBtn} ${isWished ? styles.wished : ''}`}
              onClick={() => onToggleWishlist?.(product.id)}
              title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              {isWished ? '♥' : '♡'}
            </button>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.price}>KSh {product.price.toLocaleString()}</span>
            {product.oldPrice && <>
              <span className={styles.oldPrice}>KSh {product.oldPrice.toLocaleString()}</span>
              <span className={styles.discount}>-{Math.round((1-product.price/product.oldPrice)*100)}%</span>
            </>}
          </div>

          {/* Rating summary */}
          {avgRating && (
            <div className={styles.ratingRow}>
              <span className={styles.stars}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</span>
              <span className={styles.ratingVal}>{avgRating} ({reviews.length} review{reviews.length>1?'s':''})</span>
            </div>
          )}

          {/* Stock status */}
          <div className={`${styles.stockStatus} ${inStock ? styles.inStock : styles.outOfStock}`}>
            <span className={styles.stockDot}/>
            {inStock ? 'In Stock — Order Now' : 'Currently Out of Stock'}
          </div>

          {/* ── TABS ── */}
          <div className={styles.tabs}>
            {['details','reviews'].map(t => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab===t ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'details' ? 'Details' : `Reviews (${reviews?.length||0})`}
              </button>
            ))}
          </div>

          {/* ── DETAILS TAB ── */}
          {activeTab === 'details' && (
            <div className={styles.tabContent}>
              <p className={styles.desc}>{product.desc}</p>

              {/* Color variants */}
              {product.colors && product.colors.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    Color {selectedColor && <span style={{color:'var(--purple)'}}> — {selectedColor}</span>}
                  </div>
                  <div className={styles.colorRow}>
                    {product.colors.map((c,i) => (
                      <button
                        key={i}
                        className={`${styles.colorBtn} ${selectedColor===c ? styles.colorActive : ''}`}
                        style={{ background: c }}
                        onClick={() => setSelectedColor(c)}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>
                  Size {selectedSize && <span style={{color:'var(--purple)'}}> — {selectedSize}</span>}
                </div>
                <div className={styles.sizes}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${selectedSize===s ? styles.sizeActive : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
                {product.sizes.length > 1 && !selectedSize && (
                  <p className={styles.sizeHint}>Please select a size</p>
                )}
              </div>

              {/* CTA */}
              {inStock ? (
                <button
                  className={styles.addBtn}
                  onClick={handleAdd}
                  disabled={product.sizes.length > 1 && !selectedSize}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Add to Cart
                </button>
              ) : (
                <div className={styles.notifySection}>
                  <p className={styles.notifyTitle}>Get notified when back in stock</p>
                  {notifySent ? (
                    <p className={styles.notifySuccess}>✓ We'll notify you at {notifyEmail}</p>
                  ) : (
                    <form className={styles.notifyForm} onSubmit={handleNotify}>
                      <input
                        type="email" placeholder="your@email.com"
                        value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} required
                      />
                      <button type="submit">Notify Me</button>
                    </form>
                  )}
                </div>
              )}

              {/* WhatsApp order */}
              <a
                href={`https://wa.me/254745145999?text=${encodeURIComponent(`Hello! I'm interested in "${product.name}" (KSh ${product.price.toLocaleString()})${selectedSize ? ` - Size: ${selectedSize}` : ''}`)}`}
                target="_blank" rel="noreferrer"
                className={styles.waBtn}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className={styles.tabContent}>
              {/* Existing reviews */}
              {reviews && reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                  {reviews.map(r => (
                    <div key={r.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewName}>{r.name}</span>
                        <span className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                        <span className={styles.reviewDate}>{new Date(r.date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}</span>
                      </div>
                      <p className={styles.reviewComment}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noReviews}>No reviews yet. Be the first!</p>
              )}

              {/* Add review form */}
              <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                <div className={styles.sectionLabel} style={{marginBottom:12}}>Leave a Review</div>
                <div className={styles.starPicker}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n} type="button"
                      className={`${styles.starPickBtn} ${reviewForm.rating >= n ? styles.starActive : ''}`}
                      onClick={() => setReviewForm(f => ({...f, rating:n}))}
                    >★</button>
                  ))}
                </div>
                <input
                  placeholder="Your name"
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f=>({...f,name:e.target.value}))}
                  required
                />
                <textarea
                  placeholder="Share your experience with this piece…"
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f=>({...f,comment:e.target.value}))}
                  required
                />
                <button type="submit" className={styles.reviewSubmit}>Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
