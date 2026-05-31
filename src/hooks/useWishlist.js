// src/hooks/useWishlist.js
import { useState, useCallback } from 'react';

const KEY = 'ch_wishlist_v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function useWishlist() {
  const [ids, setIds] = useState(load);

  const toggle = useCallback((id) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isWished = useCallback((id) => ids.includes(id), [ids]);

  return { wishlistIds: ids, toggleWishlist: toggle, isWished };
}
