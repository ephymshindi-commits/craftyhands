// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import AddProductForm from './AddProductForm';
import ImageUploader from '../components/ImageUploader';
import { supabase } from '../lib/supabase';
import styles from './AdminDashboard.module.css';

async function saveSetting(key, value) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) console.error('saveSetting error:', error.message);
}

async function deleteSetting(key) {
  await supabase.from('site_settings').delete().eq('key', key);
}

export default function AdminDashboard({
  products, site, onRefresh, onSiteChange, onLogout,
}) {
  const [tab,     setTab]   = useState('products');
  const [showAdd, setAdd]   = useState(false);
  const [toast,   setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  // Save site image: Cloudinary URL → Supabase → update local state instantly
  async function handleSiteImage(key, url) {
    if (url) {
      await saveSetting(key, url);
    } else {
      await deleteSetting(key);
    }
    onSiteChange(key, url || '');
    const label = key.replace('_img', '').replace('_', ' ');
    showToast(url ? `✅ ${label} image saved` : 'Image removed');
  }

  // Save product changes to Supabase
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
    showToast('✅ Product saved');
  }

  // Save product image URL to Supabase
  async function handleProductImage(id, url) {
    const { error } = await supabase
      .from('products')
      .update({ img_src: url })
      .eq('id', id);

    if (error) { showToast('❌ Image save failed: ' + error.message); return; }
    await onRefresh();
    showToast(url ? '✅ Photo saved' : 'Photo removed');
  }

  // Delete product from Supabase
  async function handleDelete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) { showToast('❌ Delete failed: ' + error.message); return; }
    await onRefresh();
    showToast('Product deleted');
  }

  // Add new product to Supabase
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
    showToast('✅ Product added');
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
            { id: 'products', icon: '🛍️', label: 'Products'        },
            { id: 'images',   icon: '🖼️', label: 'Images & Logo'    },
            { id: 'info',     icon: 'ℹ️',  label: 'Help'             },
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
          <div className={styles.cloudStatus} style={{
            background: 'rgba(61,153,112,0.2)',
            color: '#3d9970',
            border: '1px solid rgba(61,153,112,0.3)',
          }}>
            ☁️ Cloudinary Connected
          </div>
          <a href="/" target="_blank" className={styles.viewSiteBtn}>
            🌐 View Live Site
          </a>
          <button className={styles.logoutBtn} onClick={onLogout}>
            🔒 Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {tab === 'products' && 'Manage Products'}
              {tab === 'images'   && 'Images & Logo'}
              {tab === 'info'     && 'Help'}
            </h1>
            <p className={styles.pageSub}>
              {tab === 'products' && `${products.length} products · Saved to Supabase · Visible to everyone`}
              {tab === 'images'   && 'Upload → Cloudinary → saved to Supabase → live on site instantly'}
              {tab === 'info'     && 'Troubleshooting and setup guide'}
            </p>
          </div>
          {tab === 'products' && (
            <button className={styles.addBtn} onClick={() => setAdd(true)}>
              + Add Product
            </button>
          )}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No products yet.</p>
                <button className={styles.addBtn} onClick={() => setAdd(true)}>
                  + Add First Product
                </button>
              </div>
            ) : (
              products.map(p => (
                <ProductEditor
                  key={p.id}
                  product={p}
                  onUpdate={handleProductUpdate}
                  onDelete={handleDelete}
                  onImageChange={handleProductImage}
                />
              ))
            )}
          </div>
        )}

        {/* ── IMAGES & LOGO TAB ── */}
        {tab === 'images' && (
          <div className={styles.imagesGrid}>

            {/* LOGO — full width */}
            <div className={styles.imgCard} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.imgCardHeader}>
                <h3>🏷️ Brand Logo</h3>
                <p>
                  Shown in navbar and footer beside your brand name.
                  Use a transparent PNG. Square, at least 200×200px recommended.
                </p>
              </div>
              <div className={styles.logoPreviewRow}>
                {/* Live navbar preview */}
                <div className={styles.logoNavPreview}>
                  <span className={styles.previewLabel}>Navbar preview</span>
                  <div className={styles.fakeNav}>
                    {site.logo_img
                      ? <img src={site.logo_img} alt="Logo" className={styles.previewLogoImg}/>
                      : <div className={styles.previewNoLogo}>No logo</div>
                    }
                    <span className={styles.previewBrandText}>
                      Crafty <span>Hands</span>
                    </span>
                  </div>
                </div>
                <div className={styles.logoUploaderWrap}>
                  <ImageUploader
                    currentImage={site.logo_img || null}
                    onUpload={url  => handleSiteImage('logo_img', url)}
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
                <p>Main banner on the homepage. Portrait (3:4) works best.</p>
              </div>
              <div className={styles.imgCardBody}>
                <ImageUploader
                  currentImage={site.hero_img || null}
                  onUpload={url  => handleSiteImage('hero_img', url)}
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
                  onUpload={url  => handleSiteImage('story_img', url)}
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

        {/* ── HELP TAB ── */}
        {tab === 'info' && (
          <div className={styles.infoTab}>
            <div className={styles.infoCard}>
              <h3>🔴 Images show on your PC but not the live site?</h3>
              <p>This means the image uploaded but the Cloudinary URL wasn't saved to Supabase.</p>
              <ol className={styles.steps}>
                <li>Go to <strong>Admin → Images & Logo</strong></li>
                <li>Re-upload each image — it will now save the URL to Supabase automatically</li>
                <li>Refresh the live site — images will appear for all visitors</li>
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3>💾 How data is saved</h3>
              <p>Product details (name, price, sizes) → <strong>Supabase database</strong></p>
              <p>Photos → <strong>Cloudinary</strong> (permanent storage)</p>
              <p>Photo URLs → <strong>Supabase</strong> (so every device loads the same images)</p>
            </div>

            <div className={styles.infoCard}>
              <h3>⚠️ Reset products to defaults</h3>
              <p>This removes all your product customizations from Supabase. Use with caution — photos on Cloudinary are not deleted.</p>
              <button
                className={styles.dangerBtn}
                onClick={() => {
                  if (window.confirm('Reset all products? This cannot be undone.')) {
                    showToast('Please re-add products from scratch after reset.');
                  }
                }}
              >
                Reset Products
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add product modal */}
      {showAdd && (
        <AddProductForm
          onAdd={handleAdd}
          onClose={() => setAdd(false)}
        />
      )}

      {/* Toast notification */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}