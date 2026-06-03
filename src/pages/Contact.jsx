// src/pages/Contact.jsx
import { useState } from 'react';
import config from '../config';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', interest: 'Custom Order', message: ''
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) return;
    const msg = `Hello Crafty Hands!\n\nName: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\nInterested in: ${form.interest}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setForm({ firstName: '', lastName: '', email: '', phone: '', interest: 'Custom Order', message: '' });
  }

  return (
    <main>
      {/* Hero */}
      <div className={styles.pageHero}>
        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Get In Touch</span>
        <h1 className="section-title" style={{ color: 'white', fontSize: 'clamp(2.2rem,4vw,4.5rem)' }}>
          Let's Create <em style={{ color: 'var(--gold-light)' }}>Together</em>
        </h1>
      </div>

      {/* ── IMPORTANT ORDERING INFO BANNER ── */}
      <div className={styles.orderingInfo}>
        <div className={styles.orderingGrid}>

          <div className={styles.orderingCard}>
            <div className={styles.orderingIcon}>🕐</div>
            <h3>Pre-Order Timeline</h3>
            <p>All pieces are handmade to order. Please allow <strong>up to 14 days</strong> for your order to be crafted and ready for delivery or pickup.</p>
          </div>

          <div className={styles.orderingCard}>
            <div className={styles.orderingIcon}>💳</div>
            <h3>Deposit Required</h3>
            <p>A <strong>50% deposit</strong> is required to begin production on your order. The remaining balance is paid on delivery. Pay via M-Pesa Till <strong>{config.contact.mpesaTill}</strong>.</p>
          </div>

          <div className={styles.orderingCard}>
            <div className={styles.orderingIcon}>🛡️</div>
            <h3>Lost in Transit</h3>
            <p>In the rare event your order is <strong>lost during delivery</strong>, we will no replacement or any fully refund your order. Your purchase is protected.</p>
          </div>

        </div>
      </div>

      <section className={styles.section}>
        {/* FORM */}
        <div className={styles.formWrap}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 36 }}>
            Send a <em>Message</em>
          </h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.group}>
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" name="firstName" type="text" placeholder="Jane"
                  value={form.firstName} onChange={handleChange} required />
              </div>
              <div className={styles.group}>
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Doe"
                  value={form.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.group}>
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className={styles.group}>
              <label htmlFor="phone">Phone / WhatsApp</label>
              <input id="phone" name="phone" type="tel" placeholder="+254 700 000 000"
                value={form.phone} onChange={handleChange} />
            </div>
            <div className={styles.group}>
              <label htmlFor="interest">I'm Interested In</label>
              <select id="interest" name="interest" value={form.interest} onChange={handleChange}>
                <option>Custom Order</option>
                <option>Ready-to-Wear</option>
                <option>Wholesale / Bulk</option>
                <option>Collaboration</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className={styles.group}>
              <label htmlFor="message">Your Message *</label>
              <textarea id="message" name="message" rows={4}
                placeholder="Tell us about your dream piece, sizing, colours, timeline..."
                value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Send via WhatsApp
            </button>
          </form>
        </div>

        {/* INFO PANEL */}
        <div className={styles.info}>
          <span className="section-eyebrow">Find Us</span>
          <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: 20 }}>
            Crafty <em>Hands</em> KE
          </h2>
          <p className={styles.infoDesc}>
            Boutique handmade brand based in Nairobi, Kenya. We reply fast on WhatsApp!
          </p>

          <div className={styles.details}>
            <div className={styles.detail}>
              <div className={styles.detailIcon}>📱</div>
              <div>
                <strong>WhatsApp / Call</strong>
                <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noreferrer">
                  {config.contact.whatsapp.replace('254', '0')}
                </a>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.detailIcon}>💰</div>
              <div>
                <strong>M-Pesa Till Number</strong>
                <span>{config.contact.mpesaTill}</span>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.detailIcon}>📸</div>
              <div>
                <strong>Instagram</strong>
                <a href={`https://instagram.com/${config.contact.instagram}`} target="_blank" rel="noreferrer">
                  @{config.contact.instagram}
                </a>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.detailIcon}>📘</div>
              <div>
                <strong>Facebook</strong>
                <a href={`https://facebook.com/${config.contact.facebook}`} target="_blank" rel="noreferrer">
                  {config.contact.facebook}
                </a>
              </div>
            </div>
          </div>

          {/* Order policy summary box */}
          <div className={styles.policyBox}>
            <h4>📋 Order Policy Summary</h4>
            <ul>
              <li>⏱️ <strong>14-day</strong> production time on all pre-orders</li>
              <li>💳 <strong>50% deposit</strong> required to start your order</li>
              <li>🛡️ <strong>No replacement or refund</strong> if lost in transit</li>
              <li>📦 Balance paid on delivery / pickup</li>
              <li>🎨 Custom colours and sizes available on request</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}