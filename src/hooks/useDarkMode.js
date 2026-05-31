// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react';

const KEY = 'ch_dark_mode_v1';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem(KEY) === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(KEY, dark);
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}
