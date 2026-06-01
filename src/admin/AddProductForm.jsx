// src/admin/AddProductForm.jsx
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
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

  function handleField(field, value) { setForm(f => ({...f, [field]:value})); }

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
      colors: (f.colors||[]).includes(color)
        ? f.colors.filter(c => c !== color)
        : [...(f.colors||[]), color],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || form.sizes.length === 0) return;
    onAdd({
      name:     form.name.trim(),
      category: form.category,
      price:    Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      badge:    form.badge || null,
      desc:     form.desc.trim(),
      sizes:    form.sizes,
      colors:   form.colors,
      imgSrc:   form.imgSrc,
      inStock:  form.inStock,
    });
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Add New Product</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Cloudinary image upload */}
          <div className={styles.group}>
            <label>Product Photo (uploaded to Cloudinary)</label>
            <ImageUploader
              currentImage={form.imgSrc}
              onUpload={url => setForm(f => ({...f, imgSrc: url}))}
              onRemove={() => setForm(f => ({...f, imgSrc: null}))}
              folder="craftyhands/products"
              label="Upload Product Photo"
              hint="JPG, PNG, WEBP · Max 10MB"
              aspectRatio="3/4"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Product Name *</label>
              <input value={form.name} onChange={e => handleField('name', e.target.value)} placeholder="e.g. The Royale Set" required/>
            </div>
            <div className={styles.group}>
              <label>Category *</label>
              <select value={form.category} onChange={e => handleField('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Price (KSh) *</label>
              <input type="number" value={form.price} onChange={e => handleField('price', e.target.value)} placeholder="3500" min="0" required/>
            </div>
            <div className={styles.group}>
              <label>Old Price — optional</label>
              <input type="number" value={form.oldPrice} onChange={e => handleField('oldPrice', e.target.value)} placeholder="Leave blank" min="0"/>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Badge</label>
              <select value={form.badge} onChange={e => handleField('badge', e.target.value)}>
                {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
              </select>
            </div>
            <div className={styles.group}>
              <label>Stock Status</label>
              <select value={form.inStock ? 'in' : 'out'} onChange={e => handleField('inStock', e.target.value === 'in')}>
                <option value="in">✅ In Stock</option>
                <option value="out">❌ Out of Stock</option>
              </select>
            </div>
          </div>

          <div className={styles.group}>
            <label>Description</label>
            <textarea value={form.desc} onChange={e => handleField('desc', e.target.value)} rows={3} placeholder="Describe the product, materials, fit…"/>
          </div>

          <div className={styles.group}>
            <label>Available Sizes *</label>
            <div className={styles.chipGrid}>
              {ALL_SIZES.map(s => (
                <button key={s} type="button"
                  className={`${styles.chip} ${form.sizes.includes(s) ? styles.chipActive : ''}`}
                  onClick={() => toggleSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <label>Color Variants</label>
            <div className={styles.colorRow}>
              {COMMON_COLORS.map(c => (
                <button key={c} type="button"
                  className={`${styles.colorSwatch} ${form.colors.includes(c) ? styles.colorSwatchActive : ''}`}
                  style={{background:c, border:`2px solid ${form.colors.includes(c) ? '#7B4DB5' : 'rgba(255,255,255,0.15)'}`}}
                  onClick={() => toggleColor(c)} title={c}
                />
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>✅ Add Product</button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
