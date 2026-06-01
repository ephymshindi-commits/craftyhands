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
  products = [],
  site = {}, // ✅ prevents undefined crash
  onRefresh,
  onSiteChange,
  onLogout,
}) {
  const [tab, setTab] = useState('products');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleSiteImage(key, url) {
    if (url) {
      await saveSetting(key, url);
    } else {
      await deleteSetting(key);
    }

    if (onSiteChange) onSiteChange(key, url || '');
    showToast(url ? 'Saved' : 'Removed');
  }

  async function handleProductUpdate(id, changes) {
    const { error } = await supabase
      .from('products')
      .update({
        name: changes.name,
        category: changes.category,
        price: changes.price,
        old_price: changes.oldPrice || null,
        badge: changes.badge || null,
        description: changes.desc,
        sizes: changes.sizes,
        colors: changes.colors || [],
        in_stock: changes.inStock !== false,
      })
      .eq('id', id);

    if (error) {
      showToast(error.message);
      return;
    }

    if (onRefresh) await onRefresh();
    showToast('Saved');
  }

  async function handleProductImage(id, url) {
    const { error } = await supabase
      .from('products')
      .update({ img_src: url })
      .eq('id', id);

    if (error) {
      showToast(error.message);
      return;
    }

    if (onRefresh) await onRefresh();
    showToast('Image updated');
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      showToast(error.message);
      return;
    }

    if (onRefresh) await onRefresh();
    showToast('Deleted');
  }

  async function handleAdd(product) {
    const { error } = await supabase.from('products').insert({
      id: Date.now(),
      name: product.name,
      category: product.category,
      price: product.price,
      old_price: product.oldPrice || null,
      badge: product.badge || null,
      description: product.desc,
      sizes: product.sizes,
      colors: product.colors || [],
      img_src: product.imgSrc || null,
      in_stock: true,
    });

    if (error) {
      showToast(error.message);
      return;
    }

    if (onRefresh) await onRefresh();
    showToast('Added');
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>Admin</h2>

        <button onClick={() => setTab('products')}>Products</button>
        <button onClick={() => setTab('images')}>Images</button>
        <button onClick={() => setTab('info')}>Help</button>

        <button onClick={onLogout}>Logout</button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* PRODUCTS */}
        {tab === 'products' && (
          <>
            <button onClick={() => setShowAdd(true)}>+ Add</button>

            {products.length === 0 ? (
              <p>No products</p>
            ) : (
              products.map((p) => (
                <ProductEditor
                  key={p.id}
                  product={p}
                  onUpdate={handleProductUpdate}
                  onDelete={handleDelete}
                  onImageChange={handleProductImage}
                />
              ))
            )}
          </>
        )}

        {/* IMAGES */}
        {tab === 'images' && (
          <>
            <ImageUploader
              currentImage={site?.logo_img || null}
              onUpload={(url) => handleSiteImage('logo_img', url)}
              onRemove={() => handleSiteImage('logo_img', null)}
              label="Logo"
            />

            <ImageUploader
              currentImage={site?.hero_img || null}
              onUpload={(url) => handleSiteImage('hero_img', url)}
              onRemove={() => handleSiteImage('hero_img', null)}
              label="Hero"
            />

            <ImageUploader
              currentImage={site?.story_img || null}
              onUpload={(url) => handleSiteImage('story_img', url)}
              onRemove={() => handleSiteImage('story_img', null)}
              label="Story"
            />
          </>
        )}

        {/* INFO */}
        {tab === 'info' && <p>Help section</p>}
      </main>

      {/* Modal */}
      {showAdd && (
        <AddProductForm
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}