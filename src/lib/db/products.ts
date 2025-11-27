// Database operations for products
// Uses Supabase with fallback to local data
import { createServerClient, createAdminClient } from '@/lib/supabase';
import { Product } from '@/types/product';
import { normalizeText } from '@/lib/utils/text';

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
    featured: row.featured === true || row.featured === 'true' || row.featured === 1,
    new: row.new === true || row.new === 'true' || row.new === 1,
    onSale: row.on_sale === true || row.on_sale === 'true' || row.on_sale === 1,
    salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
    stock: row.stock || 0,
    christmasGift: row.christmas_gift === true || row.christmas_gift === 'true' || row.christmas_gift === 1,
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
        // Select only needed columns to reduce data transfer
        // This improves performance, especially with many products
        let query = supabase
          .from('products')
          .select('slug, category, name, price, description, image, images, country, region, producer, taste_profile, food_pairing, grapes, wine_type, spirit_type, beer_style, abv, volume_ml, featured, new, on_sale, sale_price, stock, christmas_gift, created_at', { count: 'exact' });

        // Add search filter if provided
        // Search across multiple fields to match shop page behavior
        if (searchQuery && searchQuery.trim()) {
          const search = searchQuery.trim();
          
          // Search across name, region, country, producer, description, taste_profile, food_pairing
          // Use OR to match any field containing the search term
          // Note: We'll do client-side normalization filtering as fallback for diacritics
          query = query.or(
            `name.ilike.%${search}%,region.ilike.%${search}%,country.ilike.%${search}%,producer.ilike.%${search}%,description.ilike.%${search}%,taste_profile.ilike.%${search}%,food_pairing.ilike.%${search}%`
          );
        }

        // Optimize query: order by created_at with index, limit results
        // Add a reasonable limit to prevent fetching too much data at once
        // This improves performance and reduces memory usage
        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(1000); // Reasonable limit - adjust if you have more products

        if (error) {
          console.error('Supabase query error:', error);
          // If Supabase is enabled, don't fall back to local - return empty array
          // This ensures production always uses Supabase when configured
          throw new Error(`Supabase query failed: ${error.message}`);
        }

        // If data exists (even if empty), use it
        if (data !== null && data !== undefined) {
          let results = data.map(mapRowToProduct);
          
          // Client-side normalization filter as fallback for diacritics
          // This ensures "cotes" matches "Côtes" even if Supabase .ilike doesn't handle it
          // For single-word queries, prioritize grapes and name matches to avoid false positives
          if (searchQuery && searchQuery.trim()) {
            const search = normalizeText(searchQuery.trim());
            const searchWords = search.split(/\s+/).filter(Boolean);
            const isSingleWord = searchWords.length === 1;
            
            results = results.filter(p => {
              const name = normalizeText(p.name || '');
              const slug = normalizeText(p.slug || '');
              const region = normalizeText(p.region || '');
              const country = normalizeText(p.country || '');
              const producer = normalizeText(p.producer || '');
              const description = normalizeText(p.description || '');
              const tasteProfile = normalizeText(p.tasteProfile || '');
              const foodPairing = normalizeText(p.foodPairing || '');
              const grapes = normalizeText((p.grapes || []).join(', '));
              
              // Check if it matches in primary fields (name, grapes, region, producer, country)
              const matchesPrimary = name.includes(search) ||
                slug.includes(search) ||
                region.includes(search) ||
                country.includes(search) ||
                producer.includes(search) ||
                grapes.includes(search);
              
              // Check if it matches in secondary fields (description, taste, food pairing)
              const matchesSecondary = description.includes(search) ||
                tasteProfile.includes(search) ||
                foodPairing.includes(search);
              
              // For single-word queries, require a match in primary fields to avoid false positives
              // Example: "malbec" shouldn't match Chardonnay just because description mentions Malbec
              if (isSingleWord) {
                return matchesPrimary; // Only return if it matches name, grapes, region, producer, country, or slug
              }
              
              // For multi-word queries, allow matches in any field
              return matchesPrimary || matchesSecondary;
            });
          }
          
          return results;
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        // When Supabase is enabled, don't silently fall back to local data
        // Return empty array instead - this forces the issue to be visible
        // Only fall back to local if Supabase is explicitly disabled
        throw error;
      }
    } else {
      // Supabase is enabled but client creation failed
      console.error('Supabase is enabled but client creation failed. Check environment variables.');
      throw new Error('Supabase client creation failed');
    }
  }

  // Only fall back to local data if Supabase is NOT enabled
  console.log('Using local data fallback (Supabase not enabled)');
  const { products } = await import('@/data/products');
  
  // Filter local data if search query provided
  // For single-word queries, prioritize primary fields to avoid false positives
  if (searchQuery && searchQuery.trim()) {
    const search = normalizeText(searchQuery.trim());
    const searchWords = search.split(/\s+/).filter(Boolean);
    const isSingleWord = searchWords.length === 1;
    
    return products.filter(p => {
      const name = normalizeText(p.name || '');
      const slug = normalizeText(p.slug || '');
      const region = normalizeText(p.region || '');
      const country = normalizeText(p.country || '');
      const producer = normalizeText(p.producer || '');
      const description = normalizeText(p.description || '');
      const tasteProfile = normalizeText(p.tasteProfile || '');
      const foodPairing = normalizeText(p.foodPairing || '');
      const grapes = normalizeText((p.grapes || []).join(', '));
      
      // Check if it matches in primary fields (name, grapes, region, producer, country, slug)
      const matchesPrimary = name.includes(search) ||
        slug.includes(search) ||
        region.includes(search) ||
        country.includes(search) ||
        producer.includes(search) ||
        grapes.includes(search);
      
      // Check if it matches in secondary fields (description, taste, food pairing)
      const matchesSecondary = description.includes(search) ||
        tasteProfile.includes(search) ||
        foodPairing.includes(search);
      
      // For single-word queries, require a match in primary fields to avoid false positives
      if (isSingleWord) {
        return matchesPrimary;
      }
      
      // For multi-word queries, allow matches in any field
      return matchesPrimary || matchesSecondary;
    });
  }
  
  return products;
}

// Get product by slug
export async function getProductBySlug(slugParam: string): Promise<Product | null> {
	// Normalize the slug parameter for comparison - remove diacritics
	const { normalizeText } = await import('@/lib/utils/text');
	const normalizedSlug = normalizeText(slugParam);
	
  // Try Supabase if configured
  if (USE_SUPABASE) {
    const supabase = createServerClient();
    if (supabase) {
      try {
        // First try exact match - select only needed columns
        let { data, error } = await supabase
          .from('products')
          .select('slug, category, name, price, description, image, images, country, region, producer, taste_profile, food_pairing, grapes, wine_type, spirit_type, beer_style, abv, volume_ml, featured, new, on_sale, sale_price, stock, christmas_gift, created_at')
          .eq('slug', slugParam)
          .single();

        // If not found, try normalized match with a more targeted search
        if (error || !data) {
          // Use a more targeted search instead of fetching all products
          // Try to match by slug containing parts of the search term
          const slugParts = slugParam.split('-').filter(p => p.length > 2);
          if (slugParts.length > 0) {
            // Search for products where slug contains any of the parts
            const { data: potentialMatches } = await supabase
              .from('products')
              .select('slug, category, name, price, description, image, images, country, region, producer, taste_profile, food_pairing, grapes, wine_type, spirit_type, beer_style, abv, volume_ml, featured, new, on_sale, sale_price, stock, christmas_gift, created_at')
              .ilike('slug', `%${slugParts[0]}%`)
              .limit(20); // Limit to 20 results for performance
              
            if (potentialMatches && potentialMatches.length > 0) {
              const matched = potentialMatches.find(p => {
                const productSlugNormalized = normalizeText(p.slug || '');
                return productSlugNormalized === normalizedSlug;
              });
              
              if (matched) {
                data = matched;
                error = null;
              }
            }
          }
        }

        if (!error && data) {
          return mapRowToProduct(data);
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
      }
    }
  }

  // Fallback to local data - normalized comparison
  const { products } = await import('@/data/products');
  return products.find(p => normalizeText(p.slug) === normalizedSlug) || null;
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
