// Server-side shop page with ISR (Incremental Static Regeneration)
import { getAllProducts } from "@/lib/db/products";
import { ShopPageClient } from "./ShopPageClient";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";

// ISR: Revalidate every hour (3600 seconds)
// This means the page is statically generated and cached for 1 hour
// After 1 hour, the next request will regenerate the page in the background
export const revalidate = 3600;

export default async function ShopPage() {
	// Fetch products server-side - this is cached by ISR
	// Handle timeouts gracefully during build to prevent build failures
	let products = [];
	try {
		const productsPromise = getAllProducts();
		const timeoutPromise = new Promise((_, reject) => 
			setTimeout(() => reject(new Error('Query timeout')), 20000) // 20 second timeout
		);
		
		products = await Promise.race([productsPromise, timeoutPromise]);
	} catch (error) {
		console.error('Error fetching products during build (non-fatal):', error);
		// Return empty array - page will still work, products will be fetched client-side if needed
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
