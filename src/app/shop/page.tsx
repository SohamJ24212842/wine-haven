// Dynamic shop page - products fetched client-side to avoid 19MB ISR limit
// The /api/products route is optimized and cached (1 hour), so it's fast
import { ShopPageClient } from "./ShopPageClient";
import { Container } from "@/components/ui/Container";

// Force dynamic rendering - no ISR to avoid build-time size limits
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ShopPage() {
	// Don't fetch products server-side - let client fetch immediately
	// This keeps the page under 19MB and avoids build failures
	// The /api/products route is cached (1 hour) so it's fast
	return (
		<ShopPageClient initialProducts={[]} />
	);
}
