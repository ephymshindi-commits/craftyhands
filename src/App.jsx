// src/App.jsx
import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import CartSidebar  from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import Toast, { useToast } from './components/Toast';
import WhatsAppFAB  from './components/WhatsAppFAB';

import Home     from './pages/Home';
import Shop     from './pages/Shop';
import About    from './pages/About';
import Contact  from './pages/Contact';
import Wishlist from './pages/Wishlist';
import AdminPage from './admin/AdminPage';

import { useCart }     from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useDarkMode } from './hooks/useDarkMode';
import { useReviews }  from './hooks/useReviews';

import { supabase } from './lib/supabase';

// ── helpers ──────────────────────────────────────────────────
// Converts array of {key, value} rows → plain object
// e.g. [{key:'hero_img', value:'https://...'}] → {hero_img:'https://...'}
function rowsToMap(rows) {
  return Object.fromEntries((rows || []).map(r => [r.key, r.value]));
}

// ─────────────────────────────────────────────────────────────
function AppInner() {
  const showToast = useToast();
  const [dark, toggleDark] = useDarkMode();

  const { cart, addToCart, removeFromCart, total, count, isOpen, setIsOpen } = useCart();
  const { wishlistIds, toggleWishlist, isWished } = useWishlist();
  const { addReview, getReviews } = useReviews();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // site settings — keys: hero_img, story_img, logo_img
  const [site, setSite] = useState({ hero_img: '', story_img: '', logo_img: '' });

  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ── Fetch products from Supabase ────────────────────────────
  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Product fetch error:', error.message);
    } else {
      setProducts((data || []).map(p => ({
        id:       p.id,
        name:     p.name,
        category: p.category,
        price:    p.price,
        oldPrice: p.old_price,
        badge:    p.badge,
        desc:     p.description,
        sizes:    p.sizes   || [],
        colors:   p.colors  || [],
        imgSrc:   p.img_src || p.image_url || null,  // support both column names
        inStock:  p.in_stock !== false,
      })));
    }
    setLoading(false);
  }

  // ── Fetch site settings (key/value rows) ────────────────────
  async function loadSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');   // NO .single() — fetches all rows

    if (error) {
      console.error('Settings fetch error:', error.message);
      return;
    }

    // Convert [{key:'hero_img', value:'...'}, ...] → {hero_img:'...'}
    setSite(rowsToMap(data));
  }

  // ── On mount: load data + subscribe to real-time ────────────
  useEffect(() => {
    loadProducts();
    loadSettings();

    // Real-time: products table
    const productChannel = supabase
      .channel('products-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => loadProducts()
      )
      .subscribe();

    // Real-time: site_settings table
    // Each change is a single row {key, value} — merge it into state
    const settingsChannel = supabase
      .channel('settings-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          // payload.new = { key: 'hero_img', value: 'https://...' }
          if (payload.new?.key) {
            setSite(prev => ({ ...prev, [payload.new.key]: payload.new.value }));
          } else {
            // fallback: reload all settings
            loadSettings();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const handleAddToCart = useCallback((product, size) => {
    addToCart(product, size);
    showToast?.(`${product.name} added to cart ✓`);
    setTimeout(() => setIsOpen(true), 300);
  }, [addToCart, showToast, setIsOpen]);

  const handleOpenProduct    = useCallback((p) => setSelectedProduct(p), []);
  const handleToggleWishlist = useCallback((id) => {
    const wasWished = isWished(id);
    toggleWishlist(id);
    showToast?.(wasWished ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  }, [toggleWishlist, isWished, showToast]);

  // ── Loading screen ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16,
        background: '#0f0a1a', color: 'white', fontFamily: 'Jost, sans-serif',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '2px solid rgba(91,45,142,0.3)',
          borderTopColor: '#7B4DB5',
          animation: 'spin 0.8s linear infinite',
        }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: '0.85rem', opacity: 0.5, letterSpacing: '0.1em' }}>
          Loading Crafty Hands…
        </p>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && (
        <Navbar
          cartCount={count}
          onCartOpen={() => setIsOpen(true)}
          wishlistCount={wishlistIds.length}
          dark={dark}
          onToggleDark={toggleDark}
          logoImg={site.logo_img}
        />
      )}

      <Routes>
        <Route path="/" element={
          <Home
            products={products}
            heroImg={site.hero_img}
            storyImg={site.story_img}
            onOpenProduct={handleOpenProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        }/>
        <Route path="/shop" element={
          <Shop
            products={products}
            onOpenProduct={handleOpenProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        }/>
        <Route path="/wishlist" element={
          <Wishlist
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={handleOpenProduct}
          />
        }/>
        <Route path="/about"   element={<About storyImg={site.story_img} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin"   element={
          <AdminPage
            products={products}
            onRefresh={loadProducts}
            site={site}
            onSiteChange={(key, value) =>
              setSite(prev => ({ ...prev, [key]: value }))
            }
          />
        }/>
      </Routes>

      {!isAdmin && (
        <>
          <Footer logoImg={site.logo_img} />
          <CartSidebar
            cart={cart} total={total} isOpen={isOpen}
            onClose={() => setIsOpen(false)} onRemove={removeFromCart}
          />
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isWished={selectedProduct ? isWished(selectedProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            reviews={selectedProduct ? getReviews(selectedProduct.id) : []}
            onAddReview={addReview}
          />
          <WhatsAppFAB />
        </>
      )}
      <Toast />
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppInner /></BrowserRouter>;
}
