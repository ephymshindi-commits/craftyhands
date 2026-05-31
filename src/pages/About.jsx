// src/pages/About.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import styles from './About.module.css';

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: 'Handmade with Love',
    text: 'Every stitch is placed with intention and care. Our pieces are never rushed — they\'re made when inspiration is at its peak.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Slow Fashion First',
    text: 'We reject fast fashion culture. Each piece takes time — and that time is what makes it worth wearing and worth keeping.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Premium Quality',
    text: 'We source the finest yarns and materials — because luxurious fashion deserves nothing less than the best foundation.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Made for You',
    text: 'Custom sizing and personalized orders are our specialty. Every body deserves to feel like the piece was made for them — because it was.',
  },
];

export default function About() {
  const [aboutImg, setAboutImg] = useState(null);

  function handleImg(e) {
    const file = e.target.files[0];
    if (file) setAboutImg(URL.createObjectURL(file));
  }

  return (
    <main>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Our Story</span>
          <h1 className="section-title" style={{ color: 'white', fontSize: 'clamp(2.5rem,4vw,5rem)' }}>
            Crafted with<br /><em style={{ color: 'var(--gold-light)' }}>Soul &amp; Purpose</em>
          </h1>
        </div>
      </div>

      {/* Story grid */}
      <section className={styles.body}>
        <div className={styles.storyGrid}>
          <div>
            <span className="section-eyebrow">The Beginning</span>
            <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: 24 }}>
              From <em>Passion</em><br />to Purpose
            </h2>
            <p>
              {config.brand.name} began in Nairobi with a single crochet hook and a vision:
              to create handmade fashion that felt luxurious, personal, and deeply intentional.
              Every stitch is a love letter to the art of slow fashion.
            </p>
            <p>
              We believe that fashion should tell a story — and every Crafty Hands piece carries
              the story of the hands that made it, crafted with care and made for you.
            </p>
            <p>
              "I crochet but not like your granny" — that line captures everything we stand for.
              Modern, bold, wearable art that happens to be handmade.
            </p>
            <div className={styles.signature}>by{config.brand.owner.toLowerCase()}</div>
            <Link to="/contact" className="btn-primary" style={{ display: 'inline-block', marginTop: 32 }}>
              Order a Custom Piece
            </Link>
          </div>

          <div className={styles.imgBox}>
            {aboutImg ? (
              <img src={aboutImg} alt="About Crafty Hands" className={styles.aboutImg} />
            ) : (
              <div className={styles.imgPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <label className={styles.uploadLabel}>
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Values */}
        <div className={styles.valuesSection}>
          <span className="section-eyebrow">Our Values</span>
          <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: 40 }}>
            What We <em>Stand For</em>
          </h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueText}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
