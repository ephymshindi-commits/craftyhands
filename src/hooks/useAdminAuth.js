// src/hooks/useAdminAuth.js
// Password is stored in .env as VITE_ADMIN_PASSWORD
// Never hardcoded here — add to your .env file:
//   VITE_ADMIN_PASSWORD=YourSecretPassword123
import { useState, useCallback } from 'react';

const SESSION_KEY = 'ch_admin_session';

function isLoggedIn() {
  try {
    const val = sessionStorage.getItem(SESSION_KEY);
    return val === 'true';
  } catch (_) { return false; }
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState(isLoggedIn);
  const [error,  setError]  = useState('');

  const login = useCallback((password) => {
    const correct = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!correct) {
      setError('Admin password not configured in .env');
      return false;
    }
    if (password === correct) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      setError('');
      return true;
    }
    setError('Incorrect password. Try again.');
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout, error };
}
