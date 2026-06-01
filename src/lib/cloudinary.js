// src/lib/cloudinary.js
// ─────────────────────────────────────────────────────────────
//  All Cloudinary image uploads go through this file.
//  Uses the unsigned upload API (no server needed).
//
//  SETUP:
//  1. Go to cloudinary.com → sign up free
//  2. Dashboard → Settings → Upload → Add upload preset
//     • Preset name: craftyhands_uploads
//     • Signing mode: Unsigned
//     • Folder: craftyhands  (optional but recommended)
//  3. Copy your Cloud Name from the dashboard
//  4. Add to your .env:
//       VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//       VITE_CLOUDINARY_UPLOAD_PRESET=craftyhands_uploads
// ─────────────────────────────────────────────────────────────

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'craftyhands_uploads';

/**
 * Upload a File object to Cloudinary.
 * Returns the secure URL string on success.
 * Throws on failure.
 *
 * @param {File}   file     - The image file to upload
 * @param {string} folder   - Sub-folder inside Cloudinary (e.g. 'products', 'hero')
 * @param {function} onProgress - Optional (percent: number) => void callback
 * @returns {Promise<string>} - The secure Cloudinary URL
 */
export async function uploadToCloudinary(file, folder = 'craftyhands', onProgress) {
  if (!CLOUD_NAME || CLOUD_NAME === 'decw2jxsq') {
    throw new Error(
      'Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME to your .env file.'
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  // Optimize: auto quality + auto format
  formData.append('quality', 'auto');
  formData.append('fetch_format', 'auto');

  // Use XMLHttpRequest so we can track upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err.error?.message || 'Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', url);
    xhr.send(formData);
  });
}

/**
 * Generate an optimized Cloudinary URL with transformations.
 * Useful for resizing images on the fly.
 *
 * @param {string} url    - Original Cloudinary secure_url
 * @param {object} opts   - { width, height, crop, quality }
 * @returns {string}
 */
export function cloudinaryTransform(url, { width, height, crop = 'fill', quality = 'auto' } = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = [];
  if (width)   transforms.push(`w_${width}`);
  if (height)  transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push('f_auto');

  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}

/**
 * Check if Cloudinary is configured in .env
 */
export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME && CLOUD_NAME !== 'your_cloud_name');
}
