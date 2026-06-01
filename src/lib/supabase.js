import { createClient } from '@supabase/supabase-js'

// ENV
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// CLIENT
export const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ CHECK CONFIG
export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseKey
}


// ==========================
// 🛍 PRODUCTS
// ==========================

// FETCH
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Fetch products error:', error)
    return null
  }

  return data
}

// UPSERT (add/update)
export async function upsertProduct(product) {
  const { error } = await supabase
    .from('products')
    .upsert([product])

  if (error) {
    console.error('Upsert product error:', error)
  }
}

// DELETE ✅ (fixes your first crash)
export async function deleteProductDb(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error)
  }
}


// ==========================
// 🌐 SITE SETTINGS
// (IMPORTANT: table = site_settings)
// ==========================

// FETCH ALL SETTINGS ✅ (fixes current crash)
export async function fetchAllSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Fetch settings error:', error)
    return {}
  }

  return data
}


// SAVE (hero, logo, story)
export async function saveSetting(key, value) {
  const updateData = { [key]: value }

  const { error } = await supabase
    .from('site_settings')
    .update(updateData)
    .eq('id', 1)

  if (error) {
    console.error(`Save setting (${key}) error:`, error)
  }
}

// ==========================
// 🖼 STORAGE (IMPORTANT FIX)
// ==========================

const BUCKET = 'assets' // 👈 change if your bucket name is different

export function getImageUrl(path) {
  if (!path) return ''

  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}