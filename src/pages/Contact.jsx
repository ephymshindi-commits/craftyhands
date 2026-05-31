// src/pages/Contact.jsx
import { useState } from 'react';
import config from '../config';
import { useToast } from '../components/Toast';
import styles from './Contact.module.css';

export default function Contact() {
  const showToast = useToast();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', interest: 'Custom Order', message: ''
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      showToast?.('Please fill in all required fields');
      return;
    }
    // Send via WhatsApp
    const msg = `Hello Crafty Hands!\n\nName: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\nInterested in: ${form.interest}\n\nMessage:\n${form.message}`;
    window.open(config.whatsappUrl(msg), '_blank');
    showToast?.('Opening WhatsApp to send your message ✓');
    setForm({ firstName: '', lastName: '', email: '', phone: '', interest: 'Custom Order', message: '' });
  }

  return (
    <main>
      <div className={styles.pageHero}>
        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Get In Touch</span>
        <h1 className="section-title" style={{ color: 'white', fontSize: 'clamp(2.5rem,4vw,4.5rem)' }}>
          Let's Create <em style={{ color: 'var(--gold-light)' }}>Together</em>
        </h1>
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
                <input id="firstName" name="firstName" type="text" placeholder="Jane" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className={styles.group}>
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.group}>
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className={styles.group}>
              <label htmlFor="phone">Phone / WhatsApp</label>
              <input id="phone" name="phone" type="tel" placeholder="+254 700 000 000" value={form.phone} onChange={handleChange} />
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
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your dream piece, sizing needs, timeline, or anything else..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Send via WhatsApp
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className={styles.info}>
          <span className="section-eyebrow">Find Us</span>
          <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: 20 }}>
            {config.brand.name} <em>KE</em>
          </h2>
          <p className={styles.infoDesc}>
            We're a boutique handmade brand based in Nairobi, Kenya.
            Reach out for custom orders, sizing questions, or just to say hello.
            We reply fast on WhatsApp!
          </p>

          <div className={styles.details}>
            <div className={styles.detail}>
              <div className={styles.detailIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.41a16 16 0 006.5 6.5l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <strong>WhatsApp / Call</strong>
                <a href={config.whatsappUrl('Hello Crafty Hands!')} target="_blank" rel="noreferrer">
                  {config.contact.whatsapp.replace('254', '0')}
                </a>
              </div>
            </div>

            <div className={styles.detail}>
              <div className={styles.detailIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <polyline points="8 21 12 17 16 21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div>
                <strong>M-Pesa Till Number</strong>
                <span>{config.contact.mpesaTill}</span>
              </div>
            </div>

            <div className={styles.detail}>
              <div className={styles.detailIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <div>
                <strong>Instagram</strong>
                <a href={config.instagramUrl()} target="_blank" rel="noreferrer">
                  @{config.contact.instagram}
                </a>
              </div>
            </div>

            <div className={styles.detail}>
              <div className={styles.detailIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </div>
              <div>
                <strong>Facebook</strong>
                <a href={config.facebookUrl()} target="_blank" rel="noreferrer">
                  {config.contact.facebook}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.note}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>Pay deposit first before production begins. We'll confirm availability on WhatsApp.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
