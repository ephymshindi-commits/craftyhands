// src/lib/cloudinary.js
// ─────────────────────────────────────────────────────────────
// Central Cloudinary uploader (used everywhere in the app)
// ─────────────────────────────────────────────────────────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "crafty_upload";

/**
 * MAIN UPLOAD FUNCTION (use this everywhere)
 */
export async function uploadImage(file, folder = "craftyhands", onProgress) {
  if (!file) throw new Error("No file provided");

  if (!CLOUD_NAME) {
    throw new Error("Missing VITE_CLOUDINARY_CLOUD_NAME in env");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);
  formData.append("quality", "auto");
  formData.append("fetch_format", "auto");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // progress tracking
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.secure_url);
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Invalid response from Cloudinary"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new Error("Upload aborted"));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/**
 * OPTIONAL: keep backward compatibility (so nothing breaks)
 */
export const uploadToCloudinary = uploadImage;

/**
 * Transform Cloudinary image (resize, optimize)
 */
export function cloudinaryTransform(
  url,
  { width, height, crop = "fill", quality = "auto" } = {}
) {
  if (!url || !url.includes("cloudinary.com")) return url;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push("f_auto");

  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}

/**
 * Check config
 */
export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME);
}