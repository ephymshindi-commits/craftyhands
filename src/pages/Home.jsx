// src/pages/Home.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fileToDataUrl } from '../hooks/useStore';
import config from '../config';
import styles from './Home.module.css';

export default function Home({
  products, heroImg, storyImg,
  onSetHeroImg, onSetStoryImg, onOpenProduct,
}) {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const uploadInputRef = useRef();

  async function handleHeroImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    onSetHeroImg(url);
  }

  async function handleStoryImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    onSetStoryImg(url);
  }

  function handleGalleryUpload(e) {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setUploadedPhotos(prev => [...prev, ...urls].slice(0, 9));
    e.target.value = '';
  }

  function removePhoto(idx) {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  }

  const featured = products.slice(0, 4);

  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroTag}>New Collection 2025</div>
          <h1 className={styles.heroH1}>
            Handcrafted<br />
            <em>Elegance.</em><br />
            Worn Like<br />
            Royalty.
          </h1>
          <p className={styles.heroSub}>
            Each piece is lovingly handmade — a wearable work of art that celebrates
            the beauty of slow fashion and feminine power.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/shop" className="btn-primary">Shop Collection</Link>
            <Link to="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>

        <div className={styles.heroRight}>
          {heroImg ? (
            <img src={heroImg} alt="Hero" className={styles.heroImg} />
          ) : (
            <div className={styles.heroPlaceholder}>
              <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
                <path d="M40 10C20 10 8 25 8 40s12 30 32 30 32-15 32-30S60 10 40 10Z" stroke="#7B4DB5" strokeWidth="1.5" fill="none"/>
                <path d="M30 35q10-10 20 0 10 10 0 20-10 10-20 0-10-10 0-20Z" stroke="#7B4DB5" strokeWidth="1" fill="rgba(91,45,142,0.1)"/>
              </svg>
              <p>Upload hero photo via Admin Panel</p>
              <Link to="/admin" className={styles.adminHint}>Go to Admin →</Link>
            </div>
          )}
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>100+</div>
              <div className={styles.statLabel}>Happy Clients</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>50+</div>
              <div className={styles.statLabel}>Unique Pieces</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>4.9★</div>
              <div className={styles.statLabel}>Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className={styles.marquee}>
        <div className={styles.marqueeInner}>
          {[...Array(2)].map((_, ri) => (
            <span key={ri} className={styles.marqueeTrack}>
              {['Handmade with Love','Crochet Couture','Uniquely Yours','Made in Kenya','Crafty Hands KE','Slow Fashion','Body-Fit Crochet'].map((t, i) => (
                <span key={i}>{t}<span className={styles.dot}> ✦ </span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <div>
            <span className="section-eyebrow">Featured Pieces</span>
            <h2 className="section-title">The <em>Collection</em></h2>
          </div>
          <Link to="/shop" className="btn-outline">View All</Link>
        </div>
        <div className={styles.grid}>
          {featured.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onProductImgChange={() => {}}
              onClick={onOpenProduct}
              readOnly
            />
          ))}
        </div>
      </section>

      {/* ── PHOTO GALLERY (customer showcase) ── */}
      <section className={styles.uploadSection}>
        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Customer Showcase</span>
        <h2 className="section-title" style={{ color: 'white' }}>
          Share Your <em style={{ color: 'var(--gold-light)' }}>Look</em>
        </h2>
        <div className={styles.uploadGrid}>
          <div className={styles.uploadLeft}>
            <p>
              Wearing Crafty Hands? Upload your styled photos below to share with our community.
              Tag us on Instagram <strong style={{color:'var(--gold)'}}>@{config.contact.instagram}</strong> too!
            </p>
            <div
              className={styles.dropZone}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add(styles.dragover); }}
              onDragLeave={e => e.currentTarget.classList.remove(styles.dragover)}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.classList.remove(styles.dragover);
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                const urls = files.map(f => URL.createObjectURL(f));
                setUploadedPhotos(prev => [...prev, ...urls].slice(0, 9));
              }}
            >
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleGalleryUpload}
              />
              <div className={styles.dropIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                </svg>
              </div>
              <p>
                <span onClick={() => uploadInputRef.current?.click()}>Click to upload</span>{' '}
                or drag & drop
              </p>
              <button className={styles.uploadBtn} onClick={() => uploadInputRef.current?.click()}>
                Browse Files
              </button>
            </div>
          </div>

          <div className={styles.galleryGrid}>
            {[...Array(9)].map((_, i) =>
              uploadedPhotos[i] ? (
                <div key={i} className={styles.thumb}>
                  <img src={uploadedPhotos[i]} alt={`Upload ${i + 1}`} />
                  <button className={styles.removeThumb} onClick={() => removePhoto(i)} title="Remove">✕</button>
                </div>
              ) : (
                <div key={i} className={styles.thumbEmpty}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className={styles.story}>
        <div className={styles.storyImgWrap}>
          <div className={styles.storyImg}>
            {storyImg ? (
              <img src={storyImg} alt="Brand story" />
            ) : (
              <div className={styles.storyImgPlaceholder}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{fontSize:'0.72rem',color:'#B4B2A9',letterSpacing:'0.1em',textTransform:'uppercase'}}>
                  Upload via Admin Panel
                </p>
              </div>
            )}
          </div>
          <div className={styles.storyAccent} />
          <div className={styles.storyAccentGold} />
        </div>

        <div className={styles.storyRight}>
          <span className="section-eyebrow">Our Story</span>
          <h2 className="section-title" style={{ marginBottom: 28 }}>
            Not Like<br />Your <em>Granny's</em><br />Crochet
          </h2>
          <p>
            What started as a passion project in Nairobi became something much bigger — a
            celebration of Kenyan craftsmanship, modern femininity, and the art of slow fashion.
          </p>
          <p>
            Every stitch is intentional. Every piece is a conversation between tradition and the
            contemporary woman who wears it. We don't just make clothes; we make <strong>statements.</strong>
          </p>
          <div className={styles.signature}>by{config.brand.owner.toLowerCase()}</div>
          <Link to="/about" className="btn-primary" style={{ marginTop: 32, display: 'inline-block' }}>
            Read Full Story
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.testi}>
        <div className={styles.testiHeader}>
          <span className="section-eyebrow">Client Love</span>
          <h2 className="section-title">Worn With <em>Pride</em></h2>
        </div>
        <div className={styles.testiGrid}>
          {[
            { name: 'Amina K.',    loc: 'Nairobi',  initials: 'AK', text: 'The crochet set I got is absolutely stunning. Everyone at the event kept asking who made my outfit. I felt like royalty.' },
            { name: 'Thandiwe W.', loc: 'Mombasa',  initials: 'TW', text: 'The quality is beyond what I expected. The fit is perfect and the detail in the crochet work is just beautiful. Worth every shilling.' },
            { name: 'Njeri M.',    loc: 'Kisumu',   initials: 'NM', text: "I've ordered three times now. Crafty Hands pieces are my go-to for special occasions. The handmade touch makes each piece feel exclusive." },
          ].map((t, i) => (
            <div key={i} className={styles.testiCard}>
              <div className={styles.stars}>★★★★★</div>
              <div className={styles.quote}>"</div>
              <p className={styles.testiText}>{t.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorLoc}>{t.loc}, Kenya</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
