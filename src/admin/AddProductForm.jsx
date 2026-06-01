// src/admin/AddProductForm.jsx
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { supabase } from '../lib/supabase';
import styles from './AddProductForm.module.css';

const CATEGORIES    = ['Sets', 'Tops', 'Dresses', 'Accessories'];
const BADGE_OPTIONS = ['', 'New', 'Bestseller', 'Limited', 'Sale'];
const ALL_SIZES     = ['XS', 'S', 'M', 'L', 'XL', 'Custom', 'One Size'];
const COMMON_COLORS = [
  '#000000','#FFFFFF','#5B2D8E','#C9A84C','#FF6B9D',
  '#4ECDC4','#FF6B35','#A8E6CF','#FFD93D','#6C5CE7',
];

const EMPTY = {
  name:'', category:'Sets', price:'', oldPrice:'',
  badge:'', desc:'', sizes:['S','M','L'],
  colors:[], imgSrc:null, inStock:true,
};

export default function AddProductForm({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  function handleField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function toggleSize(size) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size],
    }));
  }

  function toggleColor(color) {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(color)
        ? f.colors.filter(c => c !== color)
        : [...f.colors, color],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.price || !form.imgSrc) {
      alert("Please fill all required fields + upload image");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),
            old_price: form.oldPrice ? Number(form.oldPrice) : null,
            badge: form.badge || null,
            description: form.desc.trim(),
            sizes: form.sizes,
            colors: form.colors,
            image_url: form.imgSrc, // 🔥 THIS is Cloudinary URL
            in_stock: form.inStock,
          }
        ])
        .select();

      if (error) {
        console.error(error);
        alert("Error saving product");
        return;
      }

      // update UI (optional but good)
      onAdd(data[0]);

      alert("✅ Product saved successfully!");

      setForm(EMPTY);
      onClose();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Add New Product</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* IMAGE */}
          <div className={styles.group}>
            <label>Product Photo</label>
            <ImageUploader
              currentImage={form.imgSrc}
              onUpload={url => setForm(f => ({ ...f, imgSrc: url }))}
              onRemove={() => setForm(f => ({ ...f, imgSrc: null }))}
              folder="craftyhands/products"
            />
          </div>

          {/* NAME + CATEGORY */}
          <div className={styles.row}>
            <div className={styles.group}>
              <label>Product Name *</label>
              <input
                value={form.name}
                onChange={e => handleField('name', e.target.value)}
                required
              />
            </div>

            <div className={styles.group}>
              <label>Category *</label>
              <select
                value={form.category}
                onChange={e => handleField('category', e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* PRICE */}
          <div className={styles.row}>
            <div className={styles.group}>
              <label>Price *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => handleField('price', e.target.value)}
                required
              />
            </div>

            <div className={styles.group}>
              <label>Old Price</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={e => handleField('oldPrice', e.target.value)}
              />
            </div>
          </div>

          {/* BADGE + STOCK */}
          <div className={styles.row}>
            <div className={styles.group}>
              <label>Badge</label>
              <select
                value={form.badge}
                onChange={e => handleField('badge', e.target.value)}
              >
                {BADGE_OPTIONS.map(b => (
                  <option key={b} value={b}>{b || 'None'}</option>
                ))}
              </select>
            </div>

            <div className={styles.group}>
              <label>Stock</label>
              <select
                value={form.inStock ? 'in' : 'out'}
                onChange={e => handleField('inStock', e.target.value === 'in')}
              >
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* DESC */}
          <div className={styles.group}>
            <label>Description</label>
            <textarea
              value={form.desc}
              onChange={e => handleField('desc', e.target.value)}
            />
          </div>

          {/* SIZES */}
          <div className={styles.group}>
            <label>Sizes *</label>
            <div className={styles.chipGrid}>
              {ALL_SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div className={styles.group}>
            <label>Colors</label>
            <div className={styles.colorRow}>
              {COMMON_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  style={{ background: c }}
                  onClick={() => toggleColor(c)}
                />
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
}