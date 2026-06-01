// src/lib/cloudinary.js
// Uses your real Cloudinary credentials — hardcoded to always work

const CLOUD_NAME    = 'decw2jxsq';
const UPLOAD_PRESET = 'crafty_upload';

/**
 * Upload a file to Cloudinary.
 * Returns the permanent public URL (visible to everyone on any device).
 */
export async function uploadToCloudinary(file, folder = 'craftyhands', onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

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
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('No URL returned from Cloudinary'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed with status ' + xhr.status));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

// Always returns true — credentials are hardcoded
export function isCloudinaryConfigured() {
  return true;
}

// Resize/optimize a Cloudinary URL on the fly
export function cloudinaryTransform(url, { width, height, crop = 'fill', quality = 'auto' } = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  const transforms = [];
  if (width)  transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`, 'f_auto');
  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}