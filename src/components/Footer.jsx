// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import config from '../config';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            {config.brand.name.split(' ')[0]} <span>{config.brand.name.split(' ')[1]}</span>
          </Link>
          <p>Handmade crochet fashion crafted with love in Nairobi, Kenya. Each piece is a wearable work of art.</p>
          <div className={styles.socials}>
            <a href={config.instagramUrl()} target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href={config.facebookUrl()} target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href={config.whatsappUrl('Hello Crafty Hands!')} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?cat=Sets">Sets</Link></li>
            <li><Link to="/shop?cat=Tops">Tops</Link></li>
            <li><Link to="/shop?cat=Dresses">Dresses</Link></li>
            <li><Link to="/shop?cat=Accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Brand</h4>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/contact">Custom Orders</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Connect</h4>
          <ul>
            <li><a href={config.instagramUrl()} target="_blank" rel="noreferrer">@{config.contact.instagram}</a></li>
            <li><a href={config.whatsappUrl('Hello!')} target="_blank" rel="noreferrer">{config.contact.whatsapp.replace('254','0')}</a></li>
            <li><span>M-Pesa Till: {config.contact.mpesaTill}</span></li>
            <li><span>Pay deposit first</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} {config.brand.name} KE. Handmade with love by {config.brand.owner}.</p>
        <p>Custom orders welcome · Kenya-based boutique</p>
      </div>
    </footer>
  );
}
