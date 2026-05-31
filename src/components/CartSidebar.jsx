// src/components/CartSidebar.jsx
import { useNavigate } from 'react-router-dom';
import config from '../config';
import styles from './CartSidebar.module.css';

export default function CartSidebar({ cart, total, isOpen, onClose, onRemove }) {
  const navigate = useNavigate();

  function checkout() {
    const items = cart.map(i => `${i.name} (${i.size}) x${i.qty}`).join(', ');
    const msg = `Hello Crafty Hands! I'd like to order:\n${items}\nTotal: KSh ${total.toLocaleString()}\nPlease confirm availability and send payment details.\nM-Pesa Till: ${config.contact.mpesaTill}`;
    window.open(config.whatsappUrl(msg), '_blank');
  }

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-mid)" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your cart is empty.<br/>Discover something beautiful.</p>
              <button className="btn-outline" style={{marginTop:12}} onClick={() => { onClose(); navigate('/shop'); }}>
                Shop Now
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.id}-${item.size}`} className={styles.item}>
                <div className={styles.itemImg}>
                  {item.imgSrc
                    ? <img src={item.imgSrc} alt={item.name}/>
                    : <div className={styles.itemInitial}>{item.name[0]}</div>
                  }
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>Size: {item.size} · Qty: {item.qty}</div>
                  <button className={styles.removeBtn} onClick={() => onRemove(item.id, item.size)}>
                    Remove
                  </button>
                </div>
                <div className={styles.itemPrice}>KSh {(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>KSh {total.toLocaleString()}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={checkout}>
              Complete via WhatsApp
            </button>
            <p className={styles.mpesa}>Pay deposit via M-Pesa Till: <strong>{config.contact.mpesaTill}</strong></p>
          </div>
        )}
      </aside>
    </>
  );
}
