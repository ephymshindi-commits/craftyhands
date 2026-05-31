// src/hooks/useReviews.js
import { useState, useCallback } from 'react';

const KEY = 'ch_reviews_v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch {}
}

export function useReviews() {
  const [reviews, setReviews] = useState(load);

  const addReview = useCallback((productId, review) => {
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      const next = {
        ...prev,
        [productId]: [
          ...productReviews,
          { ...review, id: Date.now(), date: new Date().toISOString() },
        ],
      };
      save(next);
      return next;
    });
  }, []);

  const getReviews = useCallback((productId) => reviews[productId] || [], [reviews]);

  const getAvgRating = useCallback((productId) => {
    const r = reviews[productId];
    if (!r || r.length === 0) return null;
    return (r.reduce((s, x) => s + x.rating, 0) / r.length).toFixed(1);
  }, [reviews]);

  return { addReview, getReviews, getAvgRating };
}
