// API route to import all products from local data to Supabase
// POST /api/products/import
// This will import all products from src/data/products.ts

import { NextRequest, NextResponse } from 'next/server';
import { createProduct } from '@/lib/db/products';
import { products } from '@/data/products';

export async function POST(request: NextRequest) {
  try {
    const results = {
      success: [] as string[],
      errors: [] as { product: string; error: string; details?: string }[],
      skipped: [] as string[],
    };

    console.log(`Starting import of ${products.length} products...`);

    for (const product of products) {
      try {
        // Validate product has required fields
        if (!product.slug || !product.name || product.price === undefined) {
          results.errors.push({
            product: product.name || 'Unknown',
            error: 'Missing required fields',
            details: `Missing: ${!product.slug ? 'slug ' : ''}${!product.name ? 'name ' : ''}${product.price === undefined ? 'price' : ''}`,
          });
          continue;
        }

        // Try to create the product
        await createProduct(product);
        results.success.push(product.name);
        console.log(`✅ Imported: ${product.name}`);
      } catch (error: any) {
        console.error(`❌ Error importing ${product.name}:`, error.message);
        
        // Check if it's a duplicate error
        if (error.message?.includes('duplicate') || 
            error.message?.includes('unique constraint') ||
            error.message?.includes('already exists')) {
          results.skipped.push(product.name);
        } else {
          results.errors.push({
            product: product.name,
            error: error.message || 'Unknown error',
            details: error.code || error.details,
          });
        }
      }
    }

    console.log(`Import complete: ${results.success.length} success, ${results.skipped.length} skipped, ${results.errors.length} errors`);

    // Show first 5 errors in the response for debugging
    const errorPreview = results.errors.slice(0, 5);

    return NextResponse.json({
      message: 'Import complete',
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
        errors: results.errors, // Include all errors for debugging
      },
    });
  } catch (error: any) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to import products',
        details: 'Make sure Supabase is configured and the database schema is set up.',
      },
      { status: 500 }
    );
  }
}

