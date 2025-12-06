// Server-side shop page with ISR (Incremental Static Regeneration)
import { getAllProducts } from "@/lib/db/products";
import { ShopPageClient } from "./ShopPageClient";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Product } from "@/types/product";

// Make this page dynamic (not ISR) to avoid build-time timeouts
// This fetches server-side on each request, which is fast and avoids build failures
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No static generation

export default async function ShopPage() {
	// Fetch products server-side at request time (not during build)
	// Add timeout to prevent hanging - if it times out, return empty array
	// Client will fetch from API as fallback
	let products: Product[] = [];
	try {
		const productsPromise = getAllProducts();
		const timeoutPromise = new Promise<Product[]>((_, reject) => 
			setTimeout(() => reject(new Error('Query timeout')), 15000) // 15 second timeout
		);
		products = await Promise.race([productsPromise, timeoutPromise]) as Product[];
	} catch (error) {
		console.error('Error fetching products (non-fatal, will fetch client-side):', error);
		// Return empty array - ShopPageClient will fetch from API
		products = [];
	}
	
	// Pass to client component for filtering/interactivity
	return (
		<Suspense fallback={
			<Container className="py-12">
				<div className="text-center text-maroon/60">Loading shop...</div>
			</Container>
		}>
			<ShopPageClient initialProducts={products} />
		</Suspense>
	);
}
