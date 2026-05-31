// src/hooks/useStore.js
// ─────────────────────────────────────────────────────────────
//  Central store.
//  Product images are now Cloudinary URLs (strings),
//  so they're tiny in localStorage — no more base64 bloat.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'ch_products_v2';   // v2 because schema changed
const HERO_KEY    = 'ch_hero_url_v2';
const STORY_KEY   = 'ch_story_url_v2';

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return DEFAULT_PRODUCTS.map(p => ({ ...p, imgSrc: null }));
}

function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) { console.warn('Storage error:', e); }
}

export function useStore() {
  const [products, setProducts]    = useState(loadProducts);
  const [heroImg,  setHeroImgUrl]  = useState(() => localStorage.getItem(HERO_KEY)  || null);
  const [storyImg, setStoryImgUrl] = useState(() => localStorage.getItem(STORY_KEY) || null);

  // Persist products whenever they change
  useEffect(() => { save(STORAGE_KEY, products); }, [products]);

  const updateProduct = useCallback((id, changes) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  }, []);

  const addProduct = useCallback((product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // imgSrc is now a Cloudinary URL string
  const setProductImage = useCallback((id, url) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, imgSrc: url } : p));
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HERO_KEY);
    localStorage.removeItem(STORY_KEY);
    setProducts(DEFAULT_PRODUCTS.map(p => ({ ...p, imgSrc: null })));
    setHeroImgUrl(null);
    setStoryImgUrl(null);
  }, []);

  const setHeroImg = useCallback((url) => {
    save(HERO_KEY, url);
    setHeroImgUrl(url);
  }, []);

  const setStoryImg = useCallback((url) => {
    save(STORY_KEY, url);
    setStoryImgUrl(url);
  }, []);

  return {
    products, heroImg, storyImg,
    setHeroImg, setStoryImg,
    updateProduct, addProduct, deleteProduct, setProductImage,
    resetToDefaults,
  };
}

// Still kept for legacy / local preview use (not Cloudinary)
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
