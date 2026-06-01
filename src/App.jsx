// src/App.jsx
import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import Toast, { useToast } from './components/Toast';
import WhatsAppFAB from './components/WhatsAppFAB';

import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';

import AdminPage from './admin/AdminPage';

import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useDarkMode } from './hooks/useDarkMode';
import { useReviews } from './hooks/useReviews';

import { supabase } from './lib/supabase';

function AppInner() {
  const showToast = useToast();
  const [dark, toggleDark] = useDarkMode();

  const {
    cart,
    addToCart,
    removeFromCart,
    total,
    count,
    isOpen,
    setIsOpen
  } = useCart();

  const { wishlistIds, toggleWishlist, isWished } = useWishlist();
  const { addReview, getReviews } = useReviews();

  // ----------------------------
  // PRODUCTS
  // ----------------------------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // GLOBAL SITE IMAGES (🔥 FIX FOR u() ERROR)
  // ----------------------------
  const [logoImg, setLogoImg] = useState('');
  const [heroImg, setHeroImg] = useState('');
  const [storyImg, setStoryImg] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // ----------------------------
  // FETCH PRODUCTS
  // ----------------------------
  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Product fetch error:', error);
      setLoading(false);
      return;
    }

    const formatted = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.old_price,
      badge: p.badge,
      desc: p.description,
      sizes: p.sizes || [],
      colors: p.colors || [],
      imgSrc: p.image_url,
      inStock: p.in_stock,
    }));

    setProducts(formatted);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // ----------------------------
  // REFRESH AFTER ADMIN ACTIONS
  // ----------------------------
  const handleAddProduct = async () => {
    await fetchProducts();
  };

  // ----------------------------
  // CART
  // ----------------------------
  const handleAddToCart = useCallback((product, size) => {
    addToCart(product, size);
    showToast?.(`${product.name} added to cart ✓`);
    setTimeout(() => setIsOpen(true), 300);
  }, [addToCart, showToast, setIsOpen]);

  // ----------------------------
  // PRODUCT MODAL
  // ----------------------------
  const handleOpenProduct = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // ----------------------------
  // WISHLIST
  // ----------------------------
  const handleToggleWishlist = useCallback((id) => {
    const wasWished = isWished(id);
    toggleWishlist(id);
    showToast?.(wasWished ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  }, [toggleWishlist, isWished, showToast]);

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Loading products...
      </div>
    );
  }

  return (
    <>
      {/* NAVBAR */}
      {!isAdmin && (
        <Navbar
          cartCount={count}
          onCartOpen={() => setIsOpen(true)}
          wishlistCount={wishlistIds.length}
          dark={dark}
          onToggleDark={toggleDark}
          logoImg={logoImg}
        />
      )}

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              onOpenProduct={handleOpenProduct}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          }
        />

        <Route
          path="/shop"
          element={
            <Shop
              products={products}
              onOpenProduct={handleOpenProduct}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onOpenProduct={handleOpenProduct}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminPage
              products={products}
              onAddProduct={handleAddProduct}

              // 🔥 FIX: image state passed correctly
              logoImg={logoImg}
              heroImg={heroImg}
              storyImg={storyImg}

              onSetLogoImg={setLogoImg}
              onSetHeroImg={setHeroImg}
              onSetStoryImg={setStoryImg}
            />
          }
        />
      </Routes>

      {/* FOOTER + UI */}
      {!isAdmin && (
        <>
          <Footer logoImg={logoImg} />

          <CartSidebar
            cart={cart}
            total={total}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onRemove={removeFromCart}
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
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}