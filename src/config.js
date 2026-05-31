// src/config.js
// ─────────────────────────────────────────────────────────────
//  All environment variables are accessed HERE only.
//  Components import from this file — never from import.meta.env directly.
//  Real values live in .env (which is gitignored).
// ─────────────────────────────────────────────────────────────

const config = {
  brand: {
    name: import.meta.env.VITE_BRAND_NAME || 'Crafty Hands',
    tagline: import.meta.env.VITE_BRAND_TAGLINE || 'Handmade with Love',
    owner: import.meta.env.VITE_BRAND_OWNER || 'Wangara',
  },
  contact: {
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '254745145999',
    mpesaTill: import.meta.env.VITE_MPESA_TILL || '9164319',
    email: import.meta.env.VITE_CONTACT_EMAIL || '',
    instagram: import.meta.env.VITE_INSTAGRAM_HANDLE || 'CraftyHandsKe',
    facebook: import.meta.env.VITE_FACEBOOK_HANDLE || 'CraftyHandsKe',
  },
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  },
  // Helpers
  whatsappUrl(message) {
    return `https://wa.me/${this.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  },
  instagramUrl() {
    return `https://instagram.com/${this.contact.instagram}`;
  },
  facebookUrl() {
    return `https://facebook.com/${this.contact.facebook}`;
  },
};

export default config;
