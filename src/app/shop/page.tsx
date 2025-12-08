// Hybrid shop page: Server-side renders first 30 products for instant initial content
// Client-side fetches all products immediately in parallel for full data
// This keeps build size small (~60KB) while providing instant render
import { getProductsForShopInitial } from "@/lib/db/products";
import { ShopPageClient } from "./ShopPageClient";
import { Product } from "@/types/product";

// Force dynamic rendering - no ISR to avoid build-time size limits
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
	// Fetch only first 30 products server-side for instant initial render
	// This keeps the page small (~60KB) and well under 19MB limit
	// Client will fetch all products immediately in parallel
	let initialProducts: Product[] = [];
	try {
		initialProducts = await getProductsForShopInitial(30);
		console.log(`✅ [ShopPage] Server-side fetched ${initialProducts.length} initial products`);
	} catch (error: any) {
		console.error('❌ [ShopPage] Error fetching initial products:', {
			message: error?.message,
			isTimeout: error?.message?.includes('timeout'),
		});
		// Return empty - client will fetch all products
		initialProducts = [];
	}
	
	return (
		<ShopPageClient initialProducts={initialProducts} />
	);
}
