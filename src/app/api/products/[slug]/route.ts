// API route for individual product operations (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductBySlug, updateProduct, deleteProduct } from '@/lib/db/products';
import { Product } from '@/types/product';

type Params = Promise<{
  slug: string;
}>;

// Make this route dynamic to avoid build-time validation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Add cache headers to reduce database load
    const response = NextResponse.json(product);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400, max-age=3600'
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const updates = body as Partial<Product>;

    const updated = await updateProduct(slug, updates);
    
    // Revalidate homepage and shop page to reflect changes immediately
    revalidatePath('/');
    revalidatePath('/shop');
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    await deleteProduct(slug);
    
    // Revalidate homepage and shop page to reflect changes immediately
    revalidatePath('/');
    revalidatePath('/shop');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

