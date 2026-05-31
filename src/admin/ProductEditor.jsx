// src/admin/ProductEditor.jsx
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import styles from './ProductEditor.module.css';

const CATEGORIES    = ['Sets', 'Tops', 'Dresses', 'Accessories'];
const BADGE_OPTIONS = ['', 'New', 'Bestseller', 'Limited', 'Sale', 'Custom'];
const ALL_SIZES     = ['XS', 'S', 'M', 'L', 'XL', 'Custom', 'One Size'];
const COMMON_COLORS = [
  '#000000','#FFFFFF','#5B2D8E','#C9A84C','#FF6B9D',
  '#4ECDC4','#FF6B35','#A8E6CF','#FFD93D','#6C5CE7',
];

export default function ProductEditor({ product, onUpdate, onDelete, onImageChange }) {
  const [expanded, setExpanded] = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [draft,    setDraft]    = useState(product);

  function handleField(field, value) {
    setDraft(d => ({ ...d, [field]: value }));
  }

  function toggleSize(size) {
    setDraft(d => ({
      ...d,
      sizes: d.sizes.includes(size)
        ? d.sizes.filter(s => s !== size)
        : [...d.sizes, size],
    }));
  }

  function toggleColor(color) {
    setDraft(d => {
      const colors = d.colors || [];
      return {
        ...d,
        colors: colors.includes(color)
          ? colors.filter(c => c !== color)
          : [...colors, color],
      };
    });
  }

  function save() {
    onUpdate(product.id, {
      name:     draft.name,
      category: draft.category,
      price:    Number(draft.price),
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : null,
      badge:    draft.badge || null,
      desc:     draft.desc,
      sizes:    draft.sizes,
      colors:   draft.colors || [],
      inStock:  draft.inStock !== false,
    });
    setEditing(false);
  }

  return (
    <div className={`${styles.card} ${expanded ? styles.open : ''}`}>
      {/* ── HEADER ── */}
      <div className={styles.header} onClick={() => setExpanded(e => !e)}>
        <div className={styles.thumb}>
          {product.imgSrc
            ? <img src={product.imgSrc} alt={product.name}/>
            : <div className={styles.noImg}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
          }
        </div>

        <div className={styles.headerInfo}>
          <span className={styles.productName}>{product.name}</span>
          <span className={styles.productMeta}>
            {product.category} · KSh {Number(product.price).toLocaleString()}
            {product.inStock === false && <span className={styles.oos}> · Out of Stock</span>}
          </span>
        </div>

        <div className={styles.headerActions} onClick={e => e.stopPropagation()}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <button className={styles.editBtn} onClick={() => { setExpanded(true); setEditing(true); }}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => {
            if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) onDelete(product.id);
          }}>Delete</button>
          <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* ── EXPANDED BODY ── */}
      {expanded && (
        <div className={styles.body}>

          {/* ── IMAGE (always editable) ── */}
          <div className={styles.imgSection}>
            <label className={styles.imgLabel}>Product Photo (Cloudinary)</label>
            <ImageUploader
              currentImage={product.imgSrc}
              onUpload={url => onImageChange(product.id, url)}
              onRemove={() => onImageChange(product.id, null)}
              folder="craftyhands/products"
              label="Upload Product Photo"
              hint="JPG, PNG, WEBP · Max 10MB · Auto-optimized"
              aspectRatio="3/4"
            />
          </div>

          {/* ── FIELDS ── */}
          {editing ? (
            <div className={styles.fields}>
              <div className={styles.row}>
                <div className={styles.group}>
                  <label>Product Name *</label>
                  <input value={draft.name} onChange={e => handleField('name', e.target.value)}/>
                </div>
                <div className={styles.group}>
                  <label>Category *</label>
                  <select value={draft.category} onChange={e => handleField('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.group}>
                  <label>Price (KSh) *</label>
                  <input type="number" value={draft.price} onChange={e => handleField('price', e.target.value)} min="0"/>
                </div>
                <div className={styles.group}>
                  <label>Old Price (KSh) — for sale badge</label>
                  <input type="number" value={draft.oldPrice || ''} onChange={e => handleField('oldPrice', e.target.value)} min="0" placeholder="Leave blank if no sale"/>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.group}>
                  <label>Badge</label>
                  <select value={draft.badge || ''} onChange={e => handleField('badge', e.target.value)}>
                    {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
                  </select>
                </div>
                <div className={styles.group}>
                  <label>Stock Status</label>
                  <select
                    value={draft.inStock === false ? 'out' : 'in'}
                    onChange={e => handleField('inStock', e.target.value === 'in')}
                  >
                    <option value="in">✅ In Stock</option>
                    <option value="out">❌ Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className={styles.group}>
                <label>Description *</label>
                <textarea value={draft.desc} onChange={e => handleField('desc', e.target.value)} rows={3}/>
              </div>

              <div className={styles.group}>
                <label>Available Sizes</label>
                <div className={styles.chipGrid}>
                  {ALL_SIZES.map(s => (
                    <button
                      key={s} type="button"
                      className={`${styles.chip} ${draft.sizes.includes(s) ? styles.chipActive : ''}`}
                      onClick={() => toggleSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className={styles.group}>
                <label>Color Variants</label>
                <div className={styles.colorRow}>
                  {COMMON_COLORS.map(c => (
                    <button
                      key={c} type="button"
                      className={`${styles.colorSwatch} ${(draft.colors||[]).includes(c) ? styles.colorSwatchActive : ''}`}
                      style={{ background: c, border: `2px solid ${(draft.colors||[]).includes(c) ? '#7B4DB5' : 'rgba(255,255,255,0.15)'}` }}
                      onClick={() => toggleColor(c)}
                      title={c}
                    />
                  ))}
                </div>
                <p className={styles.colorHint}>Selected: {(draft.colors||[]).join(', ') || 'None'}</p>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn} onClick={save}>💾 Save Changes</button>
                <button className={styles.cancelBtn} onClick={() => { setDraft(product); setEditing(false); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.viewMode}>
              <div className={styles.viewRow}><span>Category</span><strong>{product.category}</strong></div>
              <div className={styles.viewRow}><span>Price</span><strong>KSh {Number(product.price).toLocaleString()}</strong></div>
              {product.oldPrice && <div className={styles.viewRow}><span>Old Price</span><strong>KSh {Number(product.oldPrice).toLocaleString()}</strong></div>}
              <div className={styles.viewRow}><span>Badge</span><strong>{product.badge || '—'}</strong></div>
              <div className={styles.viewRow}><span>Stock</span><strong>{product.inStock === false ? '❌ Out of Stock' : '✅ In Stock'}</strong></div>
              <div className={styles.viewRow}><span>Sizes</span><strong>{product.sizes.join(', ')}</strong></div>
              {product.colors?.length > 0 && (
                <div className={styles.viewRow}>
                  <span>Colors</span>
                  <div style={{display:'flex',gap:6}}>
                    {product.colors.map(c => (
                      <span key={c} style={{width:16,height:16,borderRadius:'50%',background:c,border:'1px solid rgba(255,255,255,0.2)',display:'inline-block'}}/>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.viewRow} style={{alignItems:'flex-start'}}><span>Description</span><strong style={{maxWidth:380,fontWeight:400,lineHeight:1.6}}>{product.desc}</strong></div>
              <button className={styles.editBtn} style={{marginTop:16}} onClick={() => setEditing(true)}>✏️ Edit Details</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
