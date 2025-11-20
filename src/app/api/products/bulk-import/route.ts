// API route for bulk importing products from JSON array
// POST /api/products/bulk-import
// Body: { products: Product[] }

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createProduct } from '@/lib/db/products';
import { Product } from '@/types/product';
import { slugify } from '@/lib/utils/text';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid request: products must be an array' },
        { status: 400 }
      );
    }

    const results = {
      success: [] as string[],
      errors: [] as { product: string; error: string; details?: string }[],
      skipped: [] as string[],
    };

    console.log(`Starting bulk import of ${products.length} products...`);

    for (const productData of products) {
      try {
        // Validate required fields
        if (!productData.name || !productData.category || productData.price === undefined || !productData.country) {
          results.errors.push({
            product: productData.name || 'Unknown',
            error: 'Missing required fields',
            details: `Missing: ${!productData.name ? 'name ' : ''}${!productData.category ? 'category ' : ''}${productData.price === undefined ? 'price ' : ''}${!productData.country ? 'country' : ''}`,
          });
          continue;
        }

        // Auto-generate slug if not provided
        const slug = productData.slug || slugify(productData.name);

        // Prepare product object
        const product: Product = {
          slug,
          category: productData.category,
          name: productData.name,
          price: Number(productData.price),
          description: productData.description || '',
          image: productData.image || 'https://placeholder.com/400x500',
          images: Array.isArray(productData.images) ? productData.images : undefined,
          country: productData.country,
          region: productData.region || undefined,
          producer: productData.producer || undefined,
          tasteProfile: productData.tasteProfile || undefined,
          foodPairing: productData.foodPairing || undefined,
          grapes: Array.isArray(productData.grapes) ? productData.grapes : undefined,
          wineType: productData.wineType || undefined,
          spiritType: productData.spiritType || undefined,
          beerStyle: productData.beerStyle || undefined,
          abv: productData.abv ? Number(productData.abv) : undefined,
          volumeMl: productData.volumeMl ? Number(productData.volumeMl) : undefined,
          stock: productData.stock ? Number(productData.stock) : 0,
          featured: productData.featured === true,
          new: productData.new === true,
          onSale: productData.onSale === true,
          salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
          christmasGift: productData.christmasGift === true,
        };

        // Try to create the product
        await createProduct(product);
        results.success.push(product.name);
        console.log(`✅ Imported: ${product.name}`);
      } catch (error: any) {
        console.error(`❌ Error importing ${productData.name}:`, error.message);
        
        // Check if it's a duplicate error
        if (error.message?.includes('duplicate') || 
            error.message?.includes('unique constraint') ||
            error.message?.includes('already exists')) {
          results.skipped.push(productData.name);
        } else {
          results.errors.push({
            product: productData.name || 'Unknown',
            error: error.message || 'Unknown error',
            details: error.code || error.details,
          });
        }
      }
    }

    console.log(`Bulk import complete: ${results.success.length} success, ${results.skipped.length} skipped, ${results.errors.length} errors`);

    // Revalidate homepage and shop page to reflect changes immediately
    if (results.success.length > 0) {
      revalidatePath('/');
      revalidatePath('/shop');
    }

    // Show first 10 errors in the response for debugging
    const errorPreview = results.errors.slice(0, 10);

    return NextResponse.json({
      message: 'Bulk import complete',
      summary: {
        total: products.length,
        success: results.success.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
      errorPreview: errorPreview.length > 0 ? errorPreview : undefined,
      results: {
        success: results.success,
        skipped: results.skipped,
        errors: results.errors,
      },
    });
  } catch (error: any) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to bulk import products',
        details: 'Make sure Supabase is configured and the request body contains a valid products array.',
      },
      { status: 500 }
    );
  }
}



