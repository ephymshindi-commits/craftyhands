// src/lib/supabase.js
// ─────────────────────────────────────────────────────────────
//  Supabase client — free database for all site data.
//  Products, images, logo, hero — all saved here.
//  Every visitor on every device sees the same data.
//
//  SETUP (5 minutes, completely free):
//  1. Go to supabase.com → New project (free)
//  2. After project loads → SQL Editor → paste the schema below → Run
//  3. Go to Project Settings → API → copy URL and anon key
//  4. Add to Vercel environment variables:
//       VITE_SUPABASE_URL  = https://xxxx.supabase.co
//       VITE_SUPABASE_ANON_KEY = your-anon-key
//
//  SQL SCHEMA (run this in Supabase SQL Editor):
// ─────────────────────────────────────────────────────────────
/*
-- Products table
create table if not exists products (
  id bigint primary key,
  name text not null,
  category text not null,
  price numeric not null,
  old_price numeric,
  badge text,
  description text,
  sizes text[],
  colors text[],
  img_src text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- Site settings (hero, story, logo images)
create table if not exists site_settings (
  key text primary key,
  value text
);

-- Enable public read access (anyone can view products)
alter table products enable row level security;
create policy "Public read" on products for select using (true);
create policy "Public write" on products for all using (true);

alter table site_settings enable row level security;
create policy "Public read" on site_settings for select using (true);
create policy "Public write" on site_settings for all using (true);

-- Insert default products
insert into products (id, name, category, price, old_price, badge, description, sizes, in_stock) values
(1, 'The Royale Set', 'Sets', 3500, 4200, 'Bestseller', 'A stunning crochet crop top and matching high-waist pants set. Body-fit silhouette with premium yarn. Available in custom colors on request.', ARRAY['XS','S','M','L','XL'], true),
(2, 'Amara Crop Top', 'Tops', 1800, null, 'New', 'Elegant fitted crochet crop top with intricate open-work detailing. Perfect styled with high-waist bottoms or layered looks.', ARRAY['XS','S','M','L'], true),
(3, 'Empress Dress', 'Dresses', 4500, 5500, 'Limited', 'Floor-length crochet maxi dress with a bold feminine silhouette. Made to order — your measurements, your dream dress.', ARRAY['S','M','L','XL','Custom'], true),
(4, 'Sunset Co-ord', 'Sets', 3200, null, null, 'Warm-toned crochet matching set featuring a halter top and wide-leg pants. Turn heads at any gathering.', ARRAY['XS','S','M','L','XL'], true),
(5, 'Woven Headband', 'Accessories', 550, null, null, 'Handcrafted crochet headband — the perfect finishing touch to any outfit. Available in multiple colors.', ARRAY['One Size'], true),
(6, 'Zuri Mini Dress', 'Dresses', 2800, 3200, 'Sale', 'Bodycon crochet mini dress with thigh-high slit detail. Bold, confident, undeniably feminine.', ARRAY['XS','S','M','L'], true)
on conflict (id) do nothing;
*/

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ── PRODUCTS ─────────────────────────────────────────────────

export async function fetchProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  if (error) { console.error('fetchProducts:', error); return null; }
  return data.map(dbToProduct);
}

export async function upsertProduct(product) {
  if (!supabase) return;
  const { error } = await supabase
    .from('products')
    .upsert(productToDb(product), { onConflict: 'id' });
  if (error) console.error('upsertProduct:', error);
}

export async function deleteProductDb(id) {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('deleteProduct:', error);
}

// ── SITE SETTINGS ─────────────────────────────────────────────

export async function fetchSetting(key) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return null;
  return data?.value || null;
}

export async function saveSetting(key, value) {
  if (!supabase) return;
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) console.error('saveSetting:', error);
}

export async function fetchAllSettings() {
  if (!supabase) return {};
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) return {};
  return Object.fromEntries((data || []).map(r => [r.key, r.value]));
}

// ── MAPPERS ───────────────────────────────────────────────────

function dbToProduct(row) {
  return {
    id:       row.id,
    name:     row.name,
    category: row.category,
    price:    row.price,
    oldPrice: row.old_price,
    badge:    row.badge,
    desc:     row.description,
    sizes:    row.sizes || [],
    colors:   row.colors || [],
    imgSrc:   row.img_src,
    inStock:  row.in_stock !== false,
  };
}

function productToDb(p) {
  return {
    id:          p.id,
    name:        p.name,
    category:    p.category,
    price:       p.price,
    old_price:   p.oldPrice || null,
    badge:       p.badge || null,
    description: p.desc,
    sizes:       p.sizes || [],
    colors:      p.colors || [],
    img_src:     p.imgSrc || null,
    in_stock:    p.inStock !== false,
  };
}