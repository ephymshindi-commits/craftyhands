// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import AddProductForm from './AddProductForm';
import ImageUploader from '../components/ImageUploader';
import { isCloudinaryConfigured } from '../lib/cloudinary';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard({
  products, heroImg, storyImg,
  onUpdateProduct, onAddProduct, onDeleteProduct, onProductImageChange,
  onSetHeroImg, onSetStoryImg, onResetDefaults, onLogout,
}) {
  const [tab,      setTab]    = useState('products');
  const [showAdd,  setAdd]    = useState(false);
  const [toast,    setToast]  = useState('');
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
            { id:'products', icon:'🛍️', label:'Products' },
            { id:'images',   icon:'🖼️', label:'Site Images' },
            { id:'info',     icon:'ℹ️',  label:'Help & Info' },
          ].map(item => (
            <button key={item.id}
              className={`${styles.navBtn} ${tab===item.id ? styles.navActive : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sideBottom}>
          {/* Cloudinary status */}
          <div className={`${styles.cloudStatus} ${cloudinaryOk ? styles.cloudOk : styles.cloudErr}`}>
            <span>{cloudinaryOk ? '☁️ Cloudinary Connected' : '⚠️ Cloudinary Not Set Up'}</span>
          </div>
          <a href="/" target="_blank" className={styles.viewSiteBtn}>🌐 View Live Site</a>
          <button className={styles.logoutBtn} onClick={onLogout}>🔒 Logout</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {tab==='products' && 'Manage Products'}
              {tab==='images'   && 'Site Images'}
              {tab==='info'     && 'Help & Info'}
            </h1>
            <p className={styles.pageSub}>
              {tab==='products' && `${products.length} products · Changes reflect instantly on the public site`}
              {tab==='images'   && 'Upload hero and brand story images via Cloudinary'}
              {tab==='info'     && 'Setup guide and troubleshooting'}
            </p>
          </div>
          {tab==='products' && (
            <button className={styles.addBtn} onClick={() => setAdd(true)}>
              + Add Product
            </button>
          )}
        </div>

        {/* ── CLOUDINARY WARNING ── */}
        {!cloudinaryOk && (
          <div className={styles.cloudWarning}>
            <strong>⚠️ Cloudinary not configured.</strong> Image uploads won't work until you add
            <code> VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> to your <code>.env</code> file.
            See the Help tab for setup steps.
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab==='products' && (
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No products yet.</p>
                <button className={styles.addBtn} onClick={() => setAdd(true)}>+ Add Your First Product</button>
              </div>
            ) : (
              products.map(p => (
                <ProductEditor
                  key={p.id}
                  product={p}
                  onUpdate={(id, changes) => { onUpdateProduct(id, changes); showToast('Product saved ✓'); }}
                  onDelete={(id) => { onDeleteProduct(id); showToast('Product deleted'); }}
                  onImageChange={(id, url) => { onProductImageChange(id, url); showToast(url ? 'Photo uploaded to Cloudinary ✓' : 'Photo removed'); }}
                />
              ))
            )}
          </div>
        )}

        {/* ── IMAGES TAB ── */}
        {tab==='images' && (
          <div className={styles.imagesGrid}>
            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>Hero Image</h3>
                <p>Large banner photo on the homepage (right side). Ideal size: 800×1000px or taller.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={heroImg}
                  onUpload={url => { onSetHeroImg(url); showToast('Hero image saved to Cloudinary ✓'); }}
                  onRemove={() => { onSetHeroImg(null); showToast('Hero image removed'); }}
                  folder="craftyhands/hero"
                  label="Upload Hero Image"
                  hint="Tall portrait image works best"
                  aspectRatio="3/4"
                />
              </div>
            </div>

            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>Brand Story Image</h3>
                <p>Photo in the "Our Story" section on the homepage. Portrait orientation preferred.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={storyImg}
                  onUpload={url => { onSetStoryImg(url); showToast('Story image saved to Cloudinary ✓'); }}
                  onRemove={() => { onSetStoryImg(null); showToast('Story image removed'); }}
                  folder="craftyhands/story"
                  label="Upload Story Image"
                  hint="Portrait photo of you or your work"
                  aspectRatio="4/5"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── INFO TAB ── */}
        {tab==='info' && (
          <div className={styles.infoTab}>

            <div className={styles.infoCard}>
              <h3>☁️ Cloudinary Setup (Required for Images)</h3>
              <ol className={styles.steps}>
                <li>Go to <strong>cloudinary.com</strong> and create a free account</li>
                <li>From your dashboard, copy your <strong>Cloud Name</strong></li>
                <li>Go to <strong>Settings → Upload → Add upload preset</strong></li>
                <li>Set preset name: <code>craftyhands_uploads</code></li>
                <li>Set signing mode: <strong>Unsigned</strong></li>
                <li>Optionally set folder: <code>craftyhands</code></li>
                <li>Open your <code>.env</code> file and add:
                  <pre className={styles.pre}>{`VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name\nVITE_CLOUDINARY_UPLOAD_PRESET=craftyhands_uploads`}</pre>
                </li>
                <li>Restart the dev server: <code>npm run dev</code></li>
              </ol>
              <div className={`${styles.statusBadge} ${cloudinaryOk ? styles.statusOk : styles.statusErr}`}>
                {cloudinaryOk ? '✅ Cloudinary is configured' : '❌ Cloudinary not yet configured'}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>🔐 Admin Access</h3>
              <p>Navigate to <code>/admin</code> — not linked anywhere on the public site.</p>
              <p>Change your password in the <code>.env</code> file under <code>VITE_ADMIN_PASSWORD</code>.</p>
            </div>

            <div className={styles.infoCard}>
              <h3>💾 How Data is Saved</h3>
              <p>Product details (name, price, description, sizes) → <strong>localStorage</strong> in your browser.</p>
              <p>Product photos, hero & story images → <strong>Cloudinary</strong> (permanent, any device).</p>
              <p>The Cloudinary URLs are then saved to localStorage so the site always shows the right images.</p>
            </div>

            <div className={styles.infoCard}>
              <h3>⚠️ Reset All Data</h3>
              <p>Deletes all product changes and clears saved image URLs. Photos on Cloudinary are not deleted.</p>
              <button className={styles.dangerBtn} onClick={() => {
                if (window.confirm('⚠️ Reset all product data? Photos stay on Cloudinary but links will be lost.')) {
                  onResetDefaults();
                  showToast('Reset to defaults ✓');
                }
              }}>Reset All Data</button>
            </div>
          </div>
        )}
      </main>

      {showAdd && (
        <AddProductForm
          onAdd={p => { onAddProduct(p); showToast('Product added ✓'); }}
          onClose={() => setAdd(false)}
        />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
