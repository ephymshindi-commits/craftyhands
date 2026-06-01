// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import AddProductForm from './AddProductForm';
import ImageUploader from '../components/ImageUploader';
import { isCloudinaryConfigured } from '../lib/cloudinary';
import { supabase } from '../lib/supabase';
import styles from './AdminDashboard.module.css';

// Save a site setting to Supabase (key/value row)
async function saveSetting(key, value) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) console.error('saveSetting error:', error.message);
}

// Delete a site setting
async function deleteSetting(key) {
  await supabase.from('site_settings').delete().eq('key', key);
}

export default function AdminDashboard({
  products, site, onRefresh, onSiteChange, onLogout,
}) {
  const [tab,     setTab]   = useState('products');
  const [showAdd, setAdd]   = useState(false);
  const [toast,   setToast] = useState('');
  const cloudOk = isCloudinaryConfigured();

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3500); }

  // Save image to Cloudinary URL → Supabase → update local state instantly
  async function handleSiteImage(key, url) {
    if (url) {
      await saveSetting(key, url);
    } else {
      await deleteSetting(key);
    }
    onSiteChange(key, url || '');   // update App state immediately (no reload needed)
    showToast(url ? `☁️ ${key.replace('_img','').replace('_',' ')} image saved ✓` : 'Image removed');
  }

  // Update product in Supabase
  async function handleProductUpdate(id, changes) {
    const { error } = await supabase
      .from('products')
      .update({
        name:        changes.name,
        category:    changes.category,
        price:       changes.price,
        old_price:   changes.oldPrice || null,
        badge:       changes.badge || null,
        description: changes.desc,
        sizes:       changes.sizes,
        colors:      changes.colors || [],
        in_stock:    changes.inStock !== false,
      })
      .eq('id', id);
    if (error) { showToast('❌ Save failed: ' + error.message); return; }
    await onRefresh();
    showToast('Product saved ✓');
  }

  // Update product image in Supabase
  async function handleProductImage(id, url) {
    const { error } = await supabase
      .from('products')
      .update({ img_src: url })
      .eq('id', id);
    if (error) { showToast('❌ Image save failed: ' + error.message); return; }
    await onRefresh();
    showToast(url ? '☁️ Photo saved ✓' : 'Photo removed');
  }

  // Delete product
  async function handleDelete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('❌ Delete failed: ' + error.message); return; }
    await onRefresh();
    showToast('Product deleted');
  }

  // Add product
  async function handleAdd(product) {
    const { error } = await supabase.from('products').insert({
      id:          Date.now(),
      name:        product.name,
      category:    product.category,
      price:       product.price,
      old_price:   product.oldPrice || null,
      badge:       product.badge || null,
      description: product.desc,
      sizes:       product.sizes,
      colors:      product.colors || [],
      img_src:     product.imgSrc || null,
      in_stock:    true,
    });
    if (error) { showToast('❌ Add failed: ' + error.message); return; }
    await onRefresh();
    showToast('Product added ✓');
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
            { id:'images',   icon:'🖼️', label:'Images & Logo' },
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
          <div className={`${styles.cloudStatus} ${cloudOk ? styles.cloudOk : styles.cloudErr}`}>
            {cloudOk ? '☁️ Cloudinary Connected' : '⚠️ Cloudinary Not Set Up'}
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
              {tab==='images'   && 'Images & Logo'}
              {tab==='info'     && 'Help & Setup'}
            </h1>
            <p className={styles.pageSub}>
              {tab==='products' && `${products.length} products · Saved to Supabase · Visible to everyone`}
              {tab==='images'   && 'Upload to Cloudinary → saved to Supabase → live on site instantly'}
              {tab==='info'     && 'Setup guide and troubleshooting'}
            </p>
          </div>
          {tab==='products' && (
            <button className={styles.addBtn} onClick={() => setAdd(true)}>+ Add Product</button>
          )}
        </div>

        {/* Cloudinary warning */}
        {!cloudOk && (
          <div className={styles.cloudWarning}>
            <strong>⚠️ Cloudinary not configured.</strong> Add <code>VITE_CLOUDINARY_CLOUD_NAME</code> and
            <code> VITE_CLOUDINARY_UPLOAD_PRESET</code> to Vercel → Settings → Environment Variables, then redeploy.
          </div>
        )}

        {/* ── PRODUCTS ── */}
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
                onUpdate={handleProductUpdate}
                onDelete={handleDelete}
                onImageChange={handleProductImage}
              />
            ))}
          </div>
        )}

        {/* ── IMAGES & LOGO ── */}
        {tab==='images' && (
          <div className={styles.imagesGrid}>

            {/* LOGO */}
            <div className={styles.imgCard} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.imgCardHeader}>
                <h3>🏷️ Brand Logo</h3>
                <p>Shown in the navbar and footer beside your brand name. Use a transparent PNG. Recommended: square, at least 200×200px.</p>
              </div>
              <div className={styles.logoPreviewRow}>
                <div className={styles.logoNavPreview}>
                  <span className={styles.previewLabel}>Navbar preview</span>
                  <div className={styles.fakeNav}>
                    {site.logo_img
                      ? <img src={site.logo_img} alt="Logo" className={styles.previewLogoImg}/>
                      : <div className={styles.previewNoLogo}>No logo</div>
                    }
                    <span className={styles.previewBrandText}>Crafty <span>Hands</span></span>
                  </div>
                </div>
                <div className={styles.logoUploaderWrap}>
                  <ImageUploader
                    currentImage={site.logo_img || null}
                    onUpload={url => handleSiteImage('logo_img', url)}
                    onRemove={() => handleSiteImage('logo_img', null)}
                    folder="craftyhands/branding"
                    label="Upload Brand Logo"
                    hint="Transparent PNG · Square · Max 5MB"
                    aspectRatio="1/1"
                    compact={!!site.logo_img}
                  />
                </div>
              </div>
            </div>

            {/* HERO */}
            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>🖼️ Hero Image</h3>
                <p>Main banner photo on the homepage right side. Portrait (3:4) works best.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={site.hero_img || null}
                  onUpload={url => handleSiteImage('hero_img', url)}
                  onRemove={() => handleSiteImage('hero_img', null)}
                  folder="craftyhands/hero"
                  label="Upload Hero Image"
                  hint="Tall portrait image · Max 10MB"
                  aspectRatio="3/4"
                />
              </div>
            </div>

            {/* STORY */}
            <div className={styles.imgCard}>
              <div className={styles.imgCardHeader}>
                <h3>📖 Brand Story Image</h3>
                <p>Photo in the "Our Story" section on the homepage.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={site.story_img || null}
                  onUpload={url => handleSiteImage('story_img', url)}
                  onRemove={() => handleSiteImage('story_img', null)}
                  folder="craftyhands/story"
                  label="Upload Story Image"
                  hint="Portrait photo of you or your workspace"
                  aspectRatio="4/5"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── HELP ── */}
        {tab==='info' && (
          <div className={styles.infoTab}>
            <div className={styles.infoCard}>
              <h3>🔴 Why images show on your PC but not the live site</h3>
              <p>This happens when Cloudinary is not configured — the image saves to your browser only. Fix:</p>
              <ol className={styles.steps}>
                <li>Go to Vercel → your project → <strong>Settings → Environment Variables</strong></li>
                <li>Add <code>VITE_CLOUDINARY_CLOUD_NAME</code> = your cloud name from cloudinary.com dashboard</li>
                <li>Add <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> = <code>craftyhands_uploads</code></li>
                <li>Click <strong>Redeploy</strong> on Vercel after adding the variables</li>
                <li>Come back to Admin → re-upload all images — they will now go to Cloudinary and be visible to everyone</li>
              </ol>
              <div className={`${styles.statusBadge} ${cloudOk ? styles.statusOk : styles.statusErr}`}>
                {cloudOk ? '✅ Cloudinary configured' : '❌ Cloudinary not configured'}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>🔴 Why the 406 error happens</h3>
              <p>The 406 error was caused by calling <code>.single()</code> on the <code>site_settings</code> table which has multiple rows. This is now fixed — the app correctly reads all rows and maps them by key.</p>
              <div className={styles.statusBadge} style={{background:'rgba(61,153,112,0.2)',color:'#3d9970'}}>✅ Fixed in this version</div>
            </div>

            <div className={styles.infoCard}>
              <h3>☁️ Cloudinary First-Time Setup</h3>
              <ol className={styles.steps}>
                <li>Go to <strong>cloudinary.com</strong> → free account</li>
                <li>Dashboard → copy your <strong>Cloud Name</strong></li>
                <li>Settings → Upload → Add upload preset:
                  <pre className={styles.pre}>{`Name: craftyhands_uploads\nSigning mode: Unsigned\nFolder: craftyhands`}</pre>
                </li>
                <li>Add both env vars to Vercel → Redeploy → re-upload images in Admin</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {showAdd && (
        <AddProductForm onAdd={handleAdd} onClose={() => setAdd(false)} />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
