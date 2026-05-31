// src/admin/AdminLogin.jsx
import { useState } from 'react';
import styles from './AdminLogin.module.css';

export default function AdminLogin({ onLogin, error }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(pw);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Crafty <span>Hands</span>
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.sub}>Enter your admin password to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Admin password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShow(s => !s)}
              tabIndex={-1}
            >
              {show ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginBtn}>
            Enter Dashboard
          </button>
        </form>

        <p className={styles.hint}>
          🔒 This page is not linked anywhere on the public site.<br/>
          Access it at <code>/admin</code>
        </p>
      </div>
    </div>
  );
}
