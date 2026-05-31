// src/App.jsx
import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import Toast, { useToast } from './components/Toast';
import WhatsAppFAB from './components/WhatsAppFAB';
import Home      from './pages/Home';
import Shop      from './pages/Shop';
import About     from './pages/About';
import Contact   from './pages/Contact';
import Wishlist  from './pages/Wishlist';
import AdminPage from './admin/AdminPage';
import { useCart }     from './hooks/useCart';
import { useStore }    from './hooks/useStore';
import { useWishlist } from './hooks/useWishlist';
import { useDarkMode } from './hooks/useDarkMode';
import { useReviews }  from './hooks/useReviews';

function AppInner() {
  const showToast = useToast();
  const [dark, toggleDark] = useDarkMode();
  const { cart, addToCart, removeFromCart, total, count, isOpen, setIsOpen } = useCart();
  const {
    products, heroImg, storyImg, logoImg,
    setHeroImg, setStoryImg, setLogoImg,
    updateProduct, addProduct, deleteProduct, setProductImage, resetToDefaults,
  } = useStore();
  const { wishlistIds, toggleWishlist, isWished } = useWishlist();
  const { addReview, getReviews }                 = useReviews();
  const [selectedProduct, setSelectedProduct]     = useState(null);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  const handleAddToCart = useCallback((product, size) => {
    addToCart(product, size);
    showToast?.(`${product.name} added to cart ✓`);
    setTimeout(() => setIsOpen(true), 350);
  }, [addToCart, showToast, setIsOpen]);

  const handleOpenProduct = useCallback((product) => setSelectedProduct(product), []);

  const handleToggleWishlist = useCallback((id) => {
    const wasWished = isWished(id);
    toggleWishlist(id);
    showToast?.(wasWished ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  }, [toggleWishlist, isWished, showToast]);

  return (
    <>
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

      <Routes>
        <Route path="/" element={
          <Home
            products={products} heroImg={heroImg} storyImg={storyImg}
            onSetHeroImg={setHeroImg} onSetStoryImg={setStoryImg}
            onOpenProduct={handleOpenProduct}
            wishlistIds={wishlistIds} onToggleWishlist={handleToggleWishlist}
          />
        }/>
        <Route path="/shop" element={
          <Shop
            products={products} onOpenProduct={handleOpenProduct}
            wishlistIds={wishlistIds} onToggleWishlist={handleToggleWishlist}
          />
        }/>
        <Route path="/wishlist" element={
          <Wishlist
            products={products} wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist} onOpenProduct={handleOpenProduct}
          />
        }/>
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin"   element={
          <AdminPage
            products={products} heroImg={heroImg} storyImg={storyImg} logoImg={logoImg}
            onUpdateProduct={updateProduct} onAddProduct={addProduct}
            onDeleteProduct={deleteProduct} onProductImageChange={setProductImage}
            onSetHeroImg={setHeroImg} onSetStoryImg={setStoryImg} onSetLogoImg={setLogoImg}
            onResetDefaults={resetToDefaults}
          />
        }/>
      </Routes>

      {!isAdmin && (
        <>
          <Footer logoImg={logoImg} />
          <CartSidebar cart={cart} total={total} isOpen={isOpen} onClose={() => setIsOpen(false)} onRemove={removeFromCart}/>
          <ProductModal
            product={selectedProduct} onClose={() => setSelectedProduct(null)}
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
