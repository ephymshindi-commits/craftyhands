// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import AddProductForm from './AddProductForm';
import ImageUploader from '../components/ImageUploader';
import { isCloudinaryConfigured } from '../lib/cloudinary';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard({
  products,
  heroImg,
  storyImg,
  logoImg,

  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onProductImageChange,

  onSetHeroImg,
  onSetStoryImg,
  onSetLogoImg,

  onResetDefaults,
  onLogout,
}) {
  const [tab, setTab] = useState('products');
  const [showAdd, setAdd] = useState(false);
  const [toast, setToast] = useState('');

  const cloudinaryOk = isCloudinaryConfigured();

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className={styles.shell}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.sideLogo}>Crafty <span>Hands</span></div>
          <div className={styles.sideLabel}>Admin Panel</div>
        </div>

        <nav className={styles.sideNav}>
          {[
            { id: 'products', icon: '🛍️', label: 'Products' },
            { id: 'images', icon: '🖼️', label: 'Site Images & Logo' },
            { id: 'info', icon: 'ℹ️', label: 'Help & Setup' },
          ].map(item => (
            <button
              key={item.id}
              className={`${styles.navBtn} ${tab === item.id ? styles.navActive : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sideBottom}>
          <div className={`${styles.cloudStatus} ${cloudinaryOk ? styles.cloudOk : styles.cloudErr}`}>
            {cloudinaryOk ? '☁️ Cloudinary Connected' : '⚠️ Cloudinary Not Set Up'}
          </div>

          <a href="/" target="_blank" className={styles.viewSiteBtn}>
            🌐 View Live Site
          </a>

          <button className={styles.logoutBtn} onClick={() => onLogout?.()}>
            🔒 Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {tab === 'products' && 'Manage Products'}
              {tab === 'images' && 'Site Images & Logo'}
              {tab === 'info' && 'Help & Setup'}
            </h1>

            <p className={styles.pageSub}>
              {tab === 'products' && `${products.length} products · Cloudinary images`}
              {tab === 'images' && 'All images upload instantly via Cloudinary'}
              {tab === 'info' && 'Setup & troubleshooting guide'}
            </p>
          </div>

          {tab === 'products' && (
            <button className={styles.addBtn} onClick={() => setAdd(true)}>
              + Add Product
            </button>
          )}
        </div>

        {/* WARNING */}
        {!cloudinaryOk && (
          <div className={styles.cloudWarning}>
            ⚠️ Cloudinary not configured. Uploads may fail.
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                No products yet
              </div>
            ) : (
              products.map(p => (
                <ProductEditor
                  key={p.id}
                  product={p}
                  onUpdate={(id, ch) => {
                    onUpdateProduct?.(id, ch);
                    showToast('Saved ✓');
                  }}
                  onDelete={(id) => {
                    onDeleteProduct?.(id);
                    showToast('Deleted');
                  }}
                  onImageChange={(id, url) => {
                    onProductImageChange?.(id, url);
                    showToast(url ? 'Image uploaded ✓' : 'Removed');
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* ── IMAGES ── */}
        {tab === 'images' && (
          <div className={styles.imagesGrid}>

            {/* LOGO */}
            <div className={styles.imgCard}>
              <h3>🏷️ Logo</h3>

              <ImageUploader
                currentImage={logoImg}
                onUpload={(url) => {
                  onSetLogoImg?.(url);
                  showToast('Logo updated ✓');
                }}
                onRemove={() => {
                  onSetLogoImg?.(null);
                  showToast('Logo removed');
                }}
                folder="craftyhands/branding"
                label="Upload Logo"
                aspectRatio="1/1"
              />
            </div>

            {/* HERO */}
            <div className={styles.imgCard}>
              <h3>🖼️ Hero Image</h3>

              <ImageUploader
                currentImage={heroImg}
                onUpload={(url) => {
                  onSetHeroImg?.(url);
                  showToast('Hero updated ✓');
                }}
                onRemove={() => {
                  onSetHeroImg?.(null);
                  showToast('Hero removed');
                }}
                folder="craftyhands/hero"
                aspectRatio="3/4"
              />
            </div>

            {/* STORY */}
            <div className={styles.imgCard}>
              <h3>📖 Story Image</h3>

              <ImageUploader
                currentImage={storyImg}
                onUpload={(url) => {
                  onSetStoryImg?.(url);
                  showToast('Story updated ✓');
                }}
                onRemove={() => {
                  onSetStoryImg?.(null);
                  showToast('Story removed');
                }}
                folder="craftyhands/story"
                aspectRatio="4/5"
              />
            </div>
          </div>
        )}

        {/* ── HELP ── */}
        {tab === 'info' && (
          <div className={styles.infoTab}>
            <p>Cloudinary + Supabase setup guide here.</p>
          </div>
        )}
      </main>

      {/* ADD PRODUCT MODAL */}
      {showAdd && (
        <AddProductForm
          onAdd={(p) => {
            onAddProduct?.(p);
            showToast('Product added ✓');
          }}
          onClose={() => setAdd(false)}
        />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}