// src/components/ImageUploader.jsx
// Uploads file → Cloudinary → returns permanent public URL
// That URL is saved to localStorage and shown on the live site for ALL users
import { useState, useRef } from 'react';
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';
import styles from './ImageUploader.module.css';

export default function ImageUploader({
  currentImage,
  onUpload,
  onRemove,
  folder = 'craftyhands',
  label = 'Upload Photo',
  hint = 'JPG, PNG, WEBP · Max 10MB',
  aspectRatio = '3/4',
  compact = false,
}) {
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('Image must be under 10MB.');     return; }

    if (!isCloudinaryConfigured()) {
      setError('⚠️ Cloudinary not set up. Add VITE_CLOUDINARY_CLOUD_NAME to your .env on Vercel.');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Upload directly to Cloudinary — returns a permanent public HTTPS URL
      const cloudUrl = await uploadToCloudinary(file, folder, setProgress);
      // Pass the Cloudinary URL up — this is what gets saved & shown to all users
      onUpload(cloudUrl);
    } catch (err) {
      setError(err.message || 'Upload failed. Check your Cloudinary settings.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      {/* Preview of current Cloudinary image */}
      {currentImage && (
        <div className={styles.preview} style={{ aspectRatio }}>
          <img src={currentImage} alt="Uploaded" />
          <div className={styles.previewActions}>
            <button className={styles.changeBtn} onClick={() => inputRef.current?.click()} disabled={uploading}>
              🔄 Change
            </button>
            <button className={styles.removeBtn} onClick={onRemove} disabled={uploading}>
              🗑️ Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!currentImage && (
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${uploading ? styles.uploading : ''}`}
          style={{ aspectRatio }}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {uploading ? (
            <div className={styles.progressWrap}>
              <div className={styles.spinner} />
              <span className={styles.progressLabel}>Uploading to Cloudinary… {progress}%</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <small className={styles.progressHint}>Do not close this window</small>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
              </div>
              <p className={styles.dropLabel}>
                <span>{label}</span>
                <small>or drag & drop here</small>
              </p>
              <p className={styles.hint}>{hint}</p>
              <div className={styles.cloudBadge}>
                ☁️ Uploads to Cloudinary — visible to all users
              </div>
            </>
          )}
        </div>
      )}

      {/* Change button when image exists but compact = true */}
      {currentImage && compact && (
        <>
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])}/>
          <button className={styles.changeBtn} onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? `Uploading ${progress}%…` : '🔄 Change Photo'}
          </button>
        </>
      )}

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
