// API route to get dynamic menu data from products
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/products';

// Make this route dynamic to avoid build-time validation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Add timeout to prevent hanging
    const productsPromise = getAllProducts();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), 15000) // 15 second timeout
    );
    
    const products = await Promise.race([productsPromise, timeoutPromise]) as Awaited<ReturnType<typeof getAllProducts>>;

    // Extract unique values from products
    const countries = Array.from(new Set(products.map(p => p.country).filter(Boolean))).sort();
    const regions = Array.from(new Set(products.map(p => p.region).filter(Boolean))).sort();
    const wineTypes = Array.from(new Set(products.filter(p => p.wineType).map(p => p.wineType!))).sort();
    const spiritTypes = Array.from(new Set(products.filter(p => p.spiritType).map(p => p.spiritType!))).sort();
    const beerStyles = Array.from(new Set(products.filter(p => p.beerStyle).map(p => p.beerStyle!))).sort();

    // Get counts for filtering
    const wineCount = products.filter(p => p.category === 'Wine').length;
    const spiritCount = products.filter(p => p.category === 'Spirit').length;
    const beerCount = products.filter(p => p.category === 'Beer').length;
    const giftCount = products.filter(p => p.christmasGift).length;
    const onSaleCount = products.filter(p => p.onSale).length;
    const sparklingCount = products.filter(p => p.wineType === 'Sparkling' || p.wineType === 'Prosecco').length;

    const response = NextResponse.json({
      countries,
      regions,
      wineTypes,
      spiritTypes,
      beerStyles,
      counts: {
        wine: wineCount,
        spirit: spiritCount,
        beer: beerCount,
        gifts: giftCount,
        onSale: onSaleCount,
        sparkling: sparklingCount,
      },
    });
    
    // Add cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400, max-age=3600'
    );
    
    return response;
  } catch (error: any) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}



