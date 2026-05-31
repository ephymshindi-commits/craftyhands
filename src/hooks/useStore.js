// src/hooks/useStore.js
import { useState, useEffect, useCallback } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'ch_products_v2';
const HERO_KEY    = 'ch_hero_url_v2';
const STORY_KEY   = 'ch_story_url_v2';
const LOGO_KEY    = 'ch_logo_url_v1';   // NEW

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
  const [products, setProducts]  = useState(loadProducts);
  const [heroImg,  setHeroState]  = useState(() => localStorage.getItem(HERO_KEY)  || null);
  const [storyImg, setStoryState] = useState(() => localStorage.getItem(STORY_KEY) || null);
  const [logoImg,  setLogoState]  = useState(() => localStorage.getItem(LOGO_KEY)  || null);

  useEffect(() => { save(STORAGE_KEY, products); }, [products]);

  const updateProduct  = useCallback((id, changes) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p)), []);
  const addProduct     = useCallback((product) => setProducts(prev => [...prev, { ...product, id: Date.now() }]), []);
  const deleteProduct  = useCallback((id) => setProducts(prev => prev.filter(p => p.id !== id)), []);
  const setProductImage = useCallback((id, url) => setProducts(prev => prev.map(p => p.id === id ? { ...p, imgSrc: url } : p)), []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HERO_KEY);
    localStorage.removeItem(STORY_KEY);
    localStorage.removeItem(LOGO_KEY);
    setProducts(DEFAULT_PRODUCTS.map(p => ({ ...p, imgSrc: null })));
    setHeroState(null); setStoryState(null); setLogoState(null);
  }, []);

  const setHeroImg  = useCallback((url) => { save(HERO_KEY, url);  setHeroState(url);  }, []);
  const setStoryImg = useCallback((url) => { save(STORY_KEY, url); setStoryState(url); }, []);
  const setLogoImg  = useCallback((url) => { save(LOGO_KEY, url);  setLogoState(url);  }, []);

  return { products, heroImg, storyImg, logoImg, setHeroImg, setStoryImg, setLogoImg, updateProduct, addProduct, deleteProduct, setProductImage, resetToDefaults };
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
