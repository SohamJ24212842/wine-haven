// API route for products (GET all, POST create)
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, createProduct } from '@/lib/db/products';
import { Product } from '@/types/product';

// Cache products for 60 seconds, allow stale-while-revalidate for 120 seconds
// This reduces database load significantly
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    
    const products = await getAllProducts(search);
    
    // Add cache headers for better performance
    const response = NextResponse.json(products);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    );
    
    return response;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    // Provide more detailed error information
    const errorMessage = error?.message || 'Failed to fetch products';
    const isSupabaseError = errorMessage.includes('Supabase');
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: isSupabaseError 
          ? 'Supabase is enabled but query failed. Check your database connection and environment variables.'
          : 'Failed to fetch products from database'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = body as Product;

    // Basic validation
    if (!product.slug || !product.name || product.price === undefined || product.price === null) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, name, price' },
        { status: 400 }
      );
    }

    // Validate price is a number
    if (typeof product.price !== 'number' || product.price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['Wine', 'Beer', 'Spirit'].includes(product.category)) {
      return NextResponse.json(
        { error: 'Category must be Wine, Beer, or Spirit' },
        { status: 400 }
      );
    }

    const created = await createProduct(product);
    
    // Revalidate homepage and shop page to reflect changes immediately
    revalidatePath('/');
    revalidatePath('/shop');
    
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    const errorMessage = error.message || 'Failed to create product';
    
    // Provide helpful error messages
    if (errorMessage.includes('not configured')) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set up Supabase first.',
          details: 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local'
        },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A product with this slug already exists. Please use a different slug.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

