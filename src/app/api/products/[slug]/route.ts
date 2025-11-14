// API route for individual product operations (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, updateProduct, deleteProduct } from '@/lib/db/products';
import { Product } from '@/types/product';

type Params = Promise<{
  slug: string;
}>;

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
    return NextResponse.json(product);
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
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

