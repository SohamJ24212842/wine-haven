// Database operations for products
// Uses Supabase with fallback to local data
import { createServerClient, createAdminClient } from '@/lib/supabase';
import { Product } from '@/types/product';

// Check if Supabase is configured AND explicitly enabled.
// This lets us point local development at the JSON data only
// while production (e.g. Vercel) can still use Supabase.
const USE_SUPABASE =
  process.env.NEXT_PUBLIC_USE_SUPABASE === 'true' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// Map database row to Product type (for Supabase)
function mapRowToProduct(row: any): Product {
  return {
    slug: row.slug,
    category: row.category,
    name: row.name,
    price: parseFloat(row.price),
    description: row.description || '',
    image: row.image || '',
    images: Array.isArray(row.images) ? row.images : undefined,
    country: row.country || '',
    region: row.region || undefined,
    producer: row.producer || undefined,
    tasteProfile: row.taste_profile || undefined,
    foodPairing: row.food_pairing || undefined,
    grapes: Array.isArray(row.grapes)
      ? row.grapes
      : (typeof row.grapes === 'string' && row.grapes.length
          ? row.grapes.split(',').map((g: string) => g.trim()).filter(Boolean)
          : undefined),
    wineType: row.wine_type || undefined,
    spiritType: row.spirit_type || undefined,
    beerStyle: row.beer_style || undefined,
    abv: row.abv ? parseFloat(row.abv) : undefined,
    volumeMl: row.volume_ml || undefined,
    featured: row.featured || false,
    new: row.new || false,
    onSale: row.on_sale || false,
    salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
    stock: row.stock || 0,
    christmasGift: row.christmas_gift || false,
  };
}

// Map Product type to database row (for Supabase)
function mapProductToRow(product: Product): any {
  return {
    slug: product.slug,
    category: product.category,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    images: product.images && product.images.length ? product.images : null,
    country: product.country,
    region: product.region || null,
    producer: product.producer || null,
    taste_profile: product.tasteProfile || null,
    food_pairing: product.foodPairing || null,
    grapes: product.grapes && product.grapes.length
      ? product.grapes
      : null,
    wine_type: product.wineType || null,
    spirit_type: product.spiritType || null,
    beer_style: product.beerStyle || null,
    abv: product.abv || null,
    volume_ml: product.volumeMl || null,
    featured: product.featured || false,
    new: product.new || false,
    on_sale: product.onSale || false,
    sale_price: product.salePrice || null,
    stock: product.stock || 0,
    christmas_gift: product.christmasGift || false,
  };
}

// Get all products
export async function getAllProducts(searchQuery?: string): Promise<Product[]> {
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createServerClient();
    if (supabase) {
      try {
        let query = supabase
          .from('products')
          .select('*');

        // Add search filter if provided
        if (searchQuery && searchQuery.trim()) {
          const search = searchQuery.trim();
          const searchWords = search.split(/\s+/).filter(Boolean);
          
          // For short queries (1-2 words), ONLY search name and region for accuracy
          // For longer queries, also include country and producer
          if (searchWords.length <= 2) {
            query = query.or(`name.ilike.%${search}%,region.ilike.%${search}%`);
          } else {
            query = query.or(
              `name.ilike.%${search}%,region.ilike.%${search}%,country.ilike.%${search}%,producer.ilike.%${search}%`
            );
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapRowToProduct);
        }
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to local data:', error);
      }
    }
  }

  // Fallback to local data
  const { products } = await import('@/data/products');
  
  // Helper to normalize diacritics for forgiving search (e.g. Côtes -> cotes)
  const normalize = (s?: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  
  // Filter local data if search query provided
  if (searchQuery && searchQuery.trim()) {
    const search = normalize(searchQuery.trim());
    const searchWords = search.split(/\s+/).filter(Boolean);
    
    return products.filter(p => {
      const name = normalize(p.name);
      const region = normalize(p.region);
      const country = normalize(p.country);
      const producer = normalize(p.producer);
      
      // For short queries (1-2 words), ONLY match name and region for accuracy
      // This prevents false positives like "cotes" matching "Champagne" or "Chianti"
      if (searchWords.length <= 2) {
        return searchWords.some(word => 
          name.includes(word) || region.includes(word)
        );
      }
      
      // For longer queries, also allow country and producer matches
      return searchWords.some(word =>
        name.includes(word) ||
        region.includes(word) ||
        country.includes(word) ||
        producer.includes(word)
      );
    });
  }
  
  return products;
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return mapRowToProduct(data);
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
      }
    }
  }

  // Fallback to local data
  const { products } = await import('@/data/products');
  return products.find(p => p.slug === slug) || null;
}

// Create product (admin only)
export async function createProduct(product: Product): Promise<Product> {
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createAdminClient();
    if (supabase) {
      try {
        const row = mapProductToRow(product);
        const { data, error } = await supabase
          .from('products')
          .insert(row)
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to create product: ${error.message} (Code: ${error.code})`);
        }

        if (!data) {
          throw new Error('No data returned from database');
        }

        return mapRowToProduct(data);
      } catch (error: any) {
        console.error('Error in createProduct:', error);
        throw error;
      }
    }
  }

  throw new Error('Supabase not configured. Please set up Supabase to create products. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local');
}

// Update product (admin only)
export async function updateProduct(slug: string, product: Partial<Product>): Promise<Product> {
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createAdminClient();
    if (supabase) {
      try {
        // First, get the existing product to merge with updates
        const existing = await getProductBySlug(slug);
        if (!existing) {
          throw new Error(`Product with slug ${slug} not found`);
        }

        // Merge existing product with updates
        const mergedProduct = { ...existing, ...product };
        const row = mapProductToRow(mergedProduct);
        
        // Don't update the slug
        delete row.slug;

        const { data, error } = await supabase
          .from('products')
          .update(row)
          .eq('slug', slug)
          .select()
          .single();

        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Failed to update product: ${error.message} (Code: ${error.code})`);
        }

        if (!data) {
          throw new Error('No data returned from database after update');
        }

        return mapRowToProduct(data);
      } catch (error: any) {
        console.error('Error in updateProduct:', error);
        throw error;
      }
    }
  }

  throw new Error('Supabase not configured. Please set up Supabase to update products.');
}

// Delete product (admin only)
export async function deleteProduct(slug: string): Promise<void> {
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createAdminClient();
    if (supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('slug', slug);

      if (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
      return;
    }
  }

  throw new Error('Supabase not configured. Please set up Supabase to delete products.');
}
