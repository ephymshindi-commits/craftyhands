// src/hooks/useStore.js
// ─────────────────────────────────────────────────────────────
//  Primary source: Supabase (shared across ALL devices/users)
//  Fallback: localStorage (if Supabase not configured)
//  Images: Cloudinary URLs stored in Supabase/localStorage
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import {
  supabase, isSupabaseConfigured,
  fetchProducts, upsertProduct, deleteProductDb,
  fetchAllSettings, saveSetting,
} from '../lib/supabase';

// ── localStorage fallback keys ────────────────────────────────
const LS_PRODUCTS = 'ch_products_v2';
const LS_HERO     = 'ch_hero_url_v2';
const LS_STORY    = 'ch_story_url_v2';
const LS_LOGO     = 'ch_logo_url_v1';

function lsSave(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (_) {}
}

function lsLoad(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function lsLoadProducts() {
  try {
    const raw = lsLoad(LS_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return DEFAULT_PRODUCTS.map(p => ({ ...p, imgSrc: null }));
}

// ── Hook ─────────────────────────────────────────────────────
export function useStore() {
  const [products, setProducts] = useState(lsLoadProducts);
  const [heroImg,  setHeroState]  = useState(() => lsLoad(LS_HERO)  || null);
  const [storyImg, setStoryState] = useState(() => lsLoad(LS_STORY) || null);
  const [logoImg,  setLogoState]  = useState(() => lsLoad(LS_LOGO)  || null);
  const [loading,  setLoading]    = useState(isSupabaseConfigured());
  const initialized = useRef(false);

  // ── Load from Supabase on mount ───────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured() || initialized.current) return;
    initialized.current = true;

    async function loadFromSupabase() {
      setLoading(true);
      try {
        // Load products
        const dbProducts = await fetchProducts();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
          lsSave(LS_PRODUCTS, JSON.stringify(dbProducts));
        }
        // Load site settings
        const settings = await fetchAllSettings();
        if (settings.hero_img)  { setHeroState(settings.hero_img);  lsSave(LS_HERO,  settings.hero_img); }
        if (settings.story_img) { setStoryState(settings.story_img); lsSave(LS_STORY, settings.story_img); }
        if (settings.logo_img)  { setLogoState(settings.logo_img);  lsSave(LS_LOGO,  settings.logo_img); }
      } catch (err) {
        console.warn('Supabase load failed, using localStorage:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFromSupabase();

    // ── Real-time updates (live sync) ──────────────────────
    if (supabase) {
      const productSub = supabase
        .channel('products-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          fetchProducts().then(p => { if (p) setProducts(p); });
        })
        .subscribe();

      const settingsSub = supabase
        .channel('settings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, async () => {
          const s = await fetchAllSettings();
          if (s.hero_img)  setHeroState(s.hero_img);
          if (s.story_img) setStoryState(s.story_img);
          if (s.logo_img)  setLogoState(s.logo_img);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(productSub);
        supabase.removeChannel(settingsSub);
      };
    }
  }, []);

  // ── Product actions ───────────────────────────────────────
  const updateProduct = useCallback(async (id, changes) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...changes } : p);
      lsSave(LS_PRODUCTS, JSON.stringify(next));
      // Save to Supabase
      const updated = next.find(p => p.id === id);
      if (updated) upsertProduct(updated);
      return next;
    });
  }, []);

  const addProduct = useCallback(async (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => {
      const next = [...prev, newProduct];
      lsSave(LS_PRODUCTS, JSON.stringify(next));
      return next;
    });
    await upsertProduct(newProduct);
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      lsSave(LS_PRODUCTS, JSON.stringify(next));
      return next;
    });
    await deleteProductDb(id);
  }, []);

  const setProductImage = useCallback(async (id, url) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, imgSrc: url } : p);
      lsSave(LS_PRODUCTS, JSON.stringify(next));
      const updated = next.find(p => p.id === id);
      if (updated) upsertProduct(updated);
      return next;
    });
  }, []);

  // ── Site image actions ────────────────────────────────────
  const setHeroImg = useCallback(async (url) => {
    setHeroState(url);
    lsSave(LS_HERO, url);
    await saveSetting('hero_img', url);
  }, []);

  const setStoryImg = useCallback(async (url) => {
    setStoryState(url);
    lsSave(LS_STORY, url);
    await saveSetting('story_img', url);
  }, []);

  const setLogoImg = useCallback(async (url) => {
    setLogoState(url);
    lsSave(LS_LOGO, url);
    await saveSetting('logo_img', url);
  }, []);

  // ── Reset ─────────────────────────────────────────────────
  const resetToDefaults = useCallback(() => {
    [LS_PRODUCTS, LS_HERO, LS_STORY, LS_LOGO].forEach(k => localStorage.removeItem(k));
    setProducts(DEFAULT_PRODUCTS.map(p => ({ ...p, imgSrc: null })));
    setHeroState(null); setStoryState(null); setLogoState(null);
  }, []);

  return {
    products, heroImg, storyImg, logoImg, loading,
    setHeroImg, setStoryImg, setLogoImg,
    updateProduct, addProduct, deleteProduct, setProductImage,
    resetToDefaults,
  };
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
