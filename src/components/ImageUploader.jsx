// src/components/ImageUploader.jsx
// ─────────────────────────────────────────────────────────────
//  Reusable image uploader used throughout admin panel.
//  Uploads to Cloudinary, shows progress, returns URL.
// ─────────────────────────────────────────────────────────────
import { useState, useRef } from 'react';
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';
import styles from './ImageUploader.module.css';

export default function ImageUploader({
  currentImage,
  onUpload,          // (cloudinaryUrl: string) => void
  onRemove,          // () => void
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

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP).');
      return;
    }
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    if (!isCloudinaryConfigured()) {
      setError('Cloudinary not configured. Check your .env file (VITE_CLOUDINARY_CLOUD_NAME).');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadToCloudinary(file, folder, setProgress);
      onUpload(url);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      {/* Current image preview */}
      {currentImage && (
        <div className={styles.preview} style={{ aspectRatio }}>
          <img src={currentImage} alt="Uploaded" />
          <div className={styles.previewActions}>
            <button
              className={styles.changeBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              🔄 Change
            </button>
            <button
              className={styles.removeBtn}
              onClick={onRemove}
              disabled={uploading}
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone (shown when no image or compact mode) */}
      {(!currentImage || compact) && (
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${uploading ? styles.uploading : ''}`}
          style={{ aspectRatio: currentImage ? undefined : aspectRatio }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />

          {uploading ? (
            <div className={styles.progressWrap}>
              <div className={styles.spinner} />
              <span className={styles.progressLabel}>Uploading… {progress}%</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
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
                <small>or drag & drop</small>
              </p>
              <p className={styles.hint}>{hint}</p>
            </>
          )}
        </div>
      )}

      {/* Error */}
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

      {/* Cloudinary badge */}
      {!uploading && (
        <div className={styles.cloudBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
          Stored on Cloudinary
        </div>
      )}
    </div>
  );
}
