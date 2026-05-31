// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import styles from './Wishlist.module.css';

export default function Wishlist({ products, wishlistIds, onToggleWishlist, onOpenProduct }) {
  const wishedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <main>
      <div className={styles.hero}>
        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Saved Items</span>
        <h1 className="section-title" style={{ color: 'white', fontSize: 'clamp(2.2rem,4vw,4.5rem)' }}>
          Your <em style={{ color: 'var(--gold-light)' }}>Wishlist</em>
        </h1>
      </div>

      <section className={styles.section}>
        {wishedProducts.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gray-mid)" strokeWidth="1.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <h2>Your wishlist is empty</h2>
            <p>Browse the collection and tap ♡ to save pieces you love.</p>
            <Link to="/shop" className="btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <>
            <p className={styles.count}>{wishedProducts.length} saved {wishedProducts.length === 1 ? 'piece' : 'pieces'}</p>
            <div className={styles.grid}>
              {wishedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={onOpenProduct}
                  readOnly
                  isWished={true}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
