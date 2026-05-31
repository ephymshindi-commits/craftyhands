// src/components/ProductCard.jsx
import styles from './ProductCard.module.css';

export default function ProductCard({
  product, onClick,
  readOnly = true,
  isWished = false,
  onToggleWishlist,
  avgRating,
}) {
  function handleWishClick(e) {
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  }

  const inStock = product.inStock !== false; // default true if not set

  return (
    <div className={`${styles.card} ${!inStock ? styles.outOfStock : ''}`} onClick={() => onClick(product)}>
      <div className={styles.imgWrap}>
        {product.imgSrc ? (
          <img src={product.imgSrc} alt={product.name} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <small>Photo coming soon</small>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className={`${styles.badge} ${product.badge === 'Sale' ? styles.badgeSale : ''}`}>
            {product.badge}
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className={styles.stockOverlay}>Out of Stock</div>
        )}

        {/* Wishlist heart */}
        {onToggleWishlist && (
          <button
            className={`${styles.heartBtn} ${isWished ? styles.hearted : ''}`}
            onClick={handleWishClick}
            title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWished ? '♥' : '♡'}
          </button>
        )}

        {/* Hover overlay */}
        <div className={styles.overlay}>
          <span className={styles.overlayBtn}>
            {inStock ? 'View Details' : 'View Details'}
          </span>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.cat}>{product.category}</div>
        <div className={styles.name}>{product.name}</div>

        {/* Rating stars */}
        {avgRating && (
          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
            <span className={styles.ratingNum}>{avgRating}</span>
          </div>
        )}

        <div className={styles.price}>
          <span className={`${styles.priceMain} ${!inStock ? styles.priceMuted : ''}`}>
            KSh {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className={styles.priceOld}>KSh {product.oldPrice.toLocaleString()}</span>
          )}
          {product.oldPrice && (
            <span className={styles.discount}>
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Color swatches if present */}
        {product.colors && product.colors.length > 0 && (
          <div className={styles.colors}>
            {product.colors.map((c, i) => (
              <span
                key={i}
                className={styles.colorDot}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
