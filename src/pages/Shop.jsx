// src/pages/Shop.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import styles from './Shop.module.css';

const SORT_OPTIONS = [
  { value: 'default',   label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'name_asc',  label: 'Name: A → Z' },
  { value: 'newest',    label: 'Newest First' },
];

export default function Shop({ products, onOpenProduct, wishlistIds, onToggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [query,        setQuery]        = useState('');
  const [sort,         setSort]         = useState('default');
  const [priceMax,     setPriceMax]     = useState(10000);
  const [showFilters,  setShowFilters]  = useState(false);

  // Max price from products
  const maxProductPrice = useMemo(
    () => Math.max(...products.map(p => p.price), 10000),
    [products]
  );

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && CATEGORIES.includes(cat)) setActiveFilter(cat);
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, []);  // only on mount

  function setFilter(cat) {
    setActiveFilter(cat);
    updateParams({ cat: cat === 'All' ? null : cat });
  }

  function handleSearch(val) {
    setQuery(val);
    updateParams({ q: val || null });
  }

  function updateParams(changes) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([k, v]) => {
        if (v == null) next.delete(k);
        else next.set(k, v);
      });
      return next;
    });
  }

  // Filter + sort pipeline
  const filtered = useMemo(() => {
    let list = [...products];

    // Category
    if (activeFilter !== 'All') list = list.filter(p => p.category === activeFilter);

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.desc || '').toLowerCase().includes(q)
      );
    }

    // Price range
    list = list.filter(p => p.price <= priceMax);

    // Sort
    switch (sort) {
      case 'price_asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price_desc': list.sort((a,b) => b.price - a.price); break;
      case 'name_asc':   list.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'newest':     list.sort((a,b) => b.id - a.id); break;
      default: break;
    }

    return list;
  }, [products, activeFilter, query, sort, priceMax]);

  function clearAll() {
    setQuery('');
    setActiveFilter('All');
    setSort('default');
    setPriceMax(maxProductPrice);
    setSearchParams({});
  }

  const hasActiveFilters = query || activeFilter !== 'All' || sort !== 'default' || priceMax < maxProductPrice;

  return (
    <main className={styles.main}>
      {/* ── HERO ── */}
      <div className={styles.pageHero}>
        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>All Products</span>
        <h1 className="section-title" style={{ color: 'white', fontSize: 'clamp(2.2rem,4vw,4.5rem)' }}>
          The Full <em style={{ color: 'var(--gold-light)' }}>Collection</em>
        </h1>
        <p className={styles.heroSub}>Every piece is handmade, body-fit, and made just for you.</p>

        {/* Search bar inside hero */}
        <div className={styles.heroSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products, categories…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button className={styles.clearSearch} onClick={() => handleSearch('')}>✕</button>
          )}
        </div>
      </div>

      <section className={styles.shopSection}>
        {/* ── TOOLBAR ── */}
        <div className={styles.toolbar}>
          {/* Category pills */}
          <div className={styles.catPills}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
                <span className={styles.filterCount}>
                  {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className={styles.toolbarRight}>
            <button
              className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ''}`}
              onClick={() => setShowFilters(f => !f)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters {showFilters ? '▲' : '▼'}
            </button>

            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── EXPANDED FILTERS PANEL ── */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterGroupLabel}>Max Price: KSh {priceMax.toLocaleString()}</label>
              <input
                type="range"
                min={0}
                max={maxProductPrice}
                step={100}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className={styles.priceSlider}
              />
              <div className={styles.priceRange}>
                <span>KSh 0</span>
                <span>KSh {maxProductPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS BAR ── */}
        <div className={styles.resultsBar}>
          <span className={styles.resultCount}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {query && <> matching <strong>"{query}"</strong></>}
          </span>
          {hasActiveFilters && (
            <button className={styles.clearBtn} onClick={clearAll}>
              ✕ Clear all filters
            </button>
          )}
        </div>

        {/* ── GRID ── */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gray-mid)" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>No products found{query ? ` for "${query}"` : ''}.</p>
            <button className="btn-outline" onClick={clearAll}>Clear Filters</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={onOpenProduct}
                readOnly
                isWished={wishlistIds?.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
