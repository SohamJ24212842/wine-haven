import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/db/products";
import { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { Product } from "@/types/product";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type Params = Promise<{ slug: string }>;

// ISR: Cache product detail pages for 1 hour to reduce database load
export const revalidate = 3600;

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
		
		// Fetch product with timeout to prevent hanging
		let product: Product | null = null;
		try {
			const productPromise = getProductBySlug(slug);
			const timeoutPromise = new Promise<Product | null>((_, reject) => 
				setTimeout(() => reject(new Error('Product lookup timeout')), 10000) // 10 second timeout
			);
			product = await Promise.race([productPromise, timeoutPromise]) as Product | null;
		} catch (error) {
			console.error(`Error fetching product with slug "${slug}":`, error);
			return notFound();
		}
		
		if (!product) {
			return notFound();
		}

		// Try to fetch all products for variety detection, but don't fail if it times out
		let allProducts: Product[] = [];
		try {
			const allProductsPromise = getAllProducts();
			const timeoutPromise = new Promise<Product[]>((_, reject) => 
				setTimeout(() => reject(new Error('Query timeout')), 10000) // 10 second timeout
			);
			allProducts = await Promise.race([allProductsPromise, timeoutPromise]) as Product[];
		} catch (error) {
			console.error('Error fetching all products for variety detection (non-critical):', error);
			// Continue without varieties - product page will still work
			allProducts = [];
		}

		const discountPercentage = product.onSale && product.salePrice 
			? calculateDiscountPercentage(product.price, product.salePrice)
			: null;

		return (
			<ErrorBoundary>
				<ProductDetailClient 
					product={product} 
					discountPercentage={discountPercentage}
					allProducts={allProducts} // May be empty if fetch failed, but that's okay
				/>
			</ErrorBoundary>
		);
	} catch (error) {
		console.error('Error loading product page:', error);
		return notFound();
	}
}


