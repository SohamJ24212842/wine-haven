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
	// This is fast because it's server-side and avoids build timeout issues
	const products = await getAllProducts();
	
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
