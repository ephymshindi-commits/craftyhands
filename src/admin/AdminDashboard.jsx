// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import AddProductForm from './AddProductForm';
import ImageUploader from '../components/ImageUploader';
import { isCloudinaryConfigured } from '../lib/cloudinary';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard({
  products, heroImg, storyImg, logoImg,
  onUpdateProduct, onAddProduct, onDeleteProduct, onProductImageChange,
  onSetHeroImg, onSetStoryImg, onSetLogoImg, onResetDefaults, onLogout,
}) {
  const [tab,     setTab]  = useState('products');
  const [showAdd, setAdd]  = useState(false);
  const [toast,   setToast] = useState('');
  const cloudinaryOk = isCloudinaryConfigured();

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

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
            { id:'images',   icon:'🖼️', label:'Site Images & Logo' },
            { id:'info',     icon:'ℹ️',  label:'Help & Setup' },
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
          <div className={`${styles.cloudStatus} ${cloudinaryOk ? styles.cloudOk : styles.cloudErr}`}>
            {cloudinaryOk ? '☁️ Cloudinary Connected' : '⚠️ Cloudinary Not Set Up'}
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
              {tab==='images'   && 'Site Images & Logo'}
              {tab==='info'     && 'Help & Setup'}
            </h1>
            <p className={styles.pageSub}>
              {tab==='products' && `${products.length} products · All photos stored on Cloudinary`}
              {tab==='images'   && 'All images upload directly to Cloudinary — visible to everyone instantly'}
              {tab==='info'     && 'Cloudinary setup guide and troubleshooting'}
            </p>
          </div>
          {tab==='products' && (
            <button className={styles.addBtn} onClick={() => setAdd(true)}>+ Add Product</button>
          )}
        </div>

        {/* Cloudinary warning */}
        {!cloudinaryOk && (
          <div className={styles.cloudWarning}>
            <strong>⚠️ Cloudinary not configured.</strong> Image uploads will fail until you add
            <code> VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> to your
            Vercel environment variables. See the Help tab.
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab==='products' && (
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No products yet.</p>
                <button className={styles.addBtn} onClick={() => setAdd(true)}>+ Add First Product</button>
              </div>
            ) : products.map(p => (
              <ProductEditor
                key={p.id} product={p}
                onUpdate={(id, ch) => { onUpdateProduct(id, ch); showToast('Product saved ✓'); }}
                onDelete={(id) => { onDeleteProduct(id); showToast('Product deleted'); }}
                onImageChange={(id, url) => { onProductImageChange(id, url); showToast(url ? '☁️ Photo uploaded to Cloudinary ✓' : 'Photo removed'); }}
              />
            ))}
          </div>
        )}

        {/* ── IMAGES & LOGO TAB ── */}
        {tab==='images' && (
          <div className={styles.imagesGrid}>

            {/* LOGO */}
            <div className={styles.imgCard} style={{gridColumn:'1/-1'}}>
              <div className={styles.imgCardHeader}>
                <div>
                  <h3>🏷️ Brand Logo</h3>
                  <p>
                    Displayed in the navbar and footer. Use a <strong>transparent PNG</strong> or square image
                    for best results. Recommended: 200×200px or wider with transparent background.
                    It will appear neatly beside your brand name.
                  </p>
                </div>
              </div>
              <div className={styles.logoPreviewRow}>
                {/* Live preview of how logo looks in navbar */}
                <div className={styles.logoNavPreview}>
                  <span className={styles.previewLabel}>Navbar preview</span>
                  <div className={styles.fakeNav}>
                    {logoImg
                      ? <img src={logoImg} alt="Logo" className={styles.previewLogoImg}/>
                      : <div className={styles.previewNoLogo}>No logo yet</div>
                    }
                    <span className={styles.previewBrandText}>Crafty <span>Hands</span></span>
                  </div>
                </div>
                <div className={styles.logoUploaderWrap}>
                  <ImageUploader
                    currentImage={logoImg}
                    onUpload={url => { onSetLogoImg(url); showToast('☁️ Logo uploaded ✓'); }}
                    onRemove={() => { onSetLogoImg(null); showToast('Logo removed'); }}
                    folder="craftyhands/branding"
                    label="Upload Brand Logo"
                    hint="PNG with transparent background recommended · Max 5MB"
                    aspectRatio="1/1"
                    compact={!!logoImg}
                  />
                </div>
              </div>
            </div>

            {/* HERO */}
            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>🖼️ Hero Image</h3>
                <p>Main banner photo on the homepage. Tall portrait (3:4) works best.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={heroImg}
                  onUpload={url => { onSetHeroImg(url); showToast('☁️ Hero image uploaded ✓'); }}
                  onRemove={() => { onSetHeroImg(null); showToast('Hero image removed'); }}
                  folder="craftyhands/hero"
                  label="Upload Hero Image"
                  hint="Portrait image (3:4 ratio) works best"
                  aspectRatio="3/4"
                />
              </div>
            </div>

            {/* STORY */}
            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>📖 Brand Story Image</h3>
                <p>Photo in the "Our Story" section. A photo of you or your work is ideal.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={storyImg}
                  onUpload={url => { onSetStoryImg(url); showToast('☁️ Story image uploaded ✓'); }}
                  onRemove={() => { onSetStoryImg(null); showToast('Story image removed'); }}
                  folder="craftyhands/story"
                  label="Upload Story Image"
                  hint="Portrait photo of you or your workspace"
                  aspectRatio="4/5"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── HELP TAB ── */}
        {tab==='info' && (
          <div className={styles.infoTab}>
            <div className={styles.infoCard}>
              <h3>☁️ Why images appear blank on the live site</h3>
              <p>If photos show on your PC but not the live site, it means the image was saved locally (to your browser) instead of Cloudinary. The fix:</p>
              <ol className={styles.steps}>
                <li>Make sure <code>VITE_CLOUDINARY_CLOUD_NAME</code> is set in Vercel → Settings → Environment Variables</li>
                <li>Make sure <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> is set to <code>craftyhands_uploads</code></li>
                <li>Go to Vercel → Deployments → Redeploy after adding the env vars</li>
                <li>Re-upload your images in the Admin panel — the new uploads will go to Cloudinary and be visible to everyone</li>
              </ol>
              <div className={`${styles.statusBadge} ${cloudinaryOk ? styles.statusOk : styles.statusErr}`}>
                {cloudinaryOk ? '✅ Cloudinary is configured' : '❌ Cloudinary not yet configured'}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>☁️ Cloudinary First-Time Setup</h3>
              <ol className={styles.steps}>
                <li>Go to <strong>cloudinary.com</strong> → free account</li>
                <li>Copy your <strong>Cloud Name</strong> from the dashboard</li>
                <li>Settings → Upload → Add upload preset → name: <code>craftyhands_uploads</code> → Signing: <strong>Unsigned</strong></li>
                <li>Vercel → your project → Settings → Environment Variables → add:
                  <pre className={styles.pre}>{`VITE_CLOUDINARY_CLOUD_NAME = your_cloud_name\nVITE_CLOUDINARY_UPLOAD_PRESET = craftyhands_uploads`}</pre>
                </li>
                <li>Vercel → Deployments → Redeploy</li>
                <li>Come back to Admin → re-upload all images</li>
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3>⚠️ Reset All Data</h3>
              <p>Clears all product changes and image URL links. Photos on Cloudinary are NOT deleted.</p>
              <button className={styles.dangerBtn} onClick={() => {
                if (window.confirm('Reset all data? Image links will be cleared but Cloudinary photos stay.')) {
                  onResetDefaults(); showToast('Reset done ✓');
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
