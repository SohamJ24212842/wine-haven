import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/db/products";
import { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

type Params = Promise<{ slug: string }>;

// Cache product detail pages for 1 hour to reduce database load
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
		
		// Fetch product and all products in parallel for better performance
		// Both use in-memory cache, so this is very fast
		const [product, allProducts] = await Promise.all([
			getProductBySlug(slug),
			getAllProducts(), // Always fetch for variety detection (cached, so fast)
		]);
		
		if (!product) return notFound();

		const discountPercentage = product.onSale && product.salePrice 
			? calculateDiscountPercentage(product.price, product.salePrice)
			: null;

		return <ProductDetailClient 
			product={product} 
			discountPercentage={discountPercentage}
			allProducts={allProducts} // Always provided from server
		/>;
	} catch (error) {
		console.error('Error loading product page:', error);
		return notFound();
	}
}


