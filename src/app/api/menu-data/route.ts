// API route to get dynamic menu data from products
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/products';

// Cache menu data for 1 hour - it doesn't change frequently
export const revalidate = 3600;

export async function GET() {
  try {
    const products = await getAllProducts();

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



