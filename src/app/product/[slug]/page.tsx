import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/db/products";
import { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { Product } from "@/types/product";

type Params = Promise<{ slug: string }>;

// Make this page dynamic (not ISR) to avoid build-time timeouts
// This fetches server-side on each request, which is fast and avoids build failures
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No static generation

// Optimize metadata - use generic title to avoid duplicate database query
// The actual product name is in the page content, so this is fine
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	return {
		title: "Product | Wine Haven",
		description: "View product details at Wine Haven",
	};
}

function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
	return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export default async function ProductDetailPage({ params }: { params: Params }) {
	try {
		const { slug } = await params;
		
		// Fetch product - server-side rendering (fast, no build-time issues)
		const product = await getProductBySlug(slug);
		
		if (!product) {
			return notFound();
		}

		// Try to fetch all products for variety detection, but don't fail if it times out
		let allProducts: Product[] = [];
		try {
			allProducts = await getAllProducts();
		} catch (error) {
			console.error('Error fetching all products for variety detection (non-critical):', error);
			// Continue without varieties - product page will still work
			allProducts = [];
		}

		const discountPercentage = product.onSale && product.salePrice 
			? calculateDiscountPercentage(product.price, product.salePrice)
			: null;

		return <ProductDetailClient 
			product={product} 
			discountPercentage={discountPercentage}
			allProducts={allProducts} // May be empty if fetch failed, but that's okay
		/>;
	} catch (error) {
		console.error('Error loading product page:', error);
		return notFound();
	}
}


