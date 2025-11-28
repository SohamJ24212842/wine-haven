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
	const { slug } = await params;
	
	// Fetch product - now uses in-memory cache for faster responses
	const product = await getProductBySlug(slug);
	
	if (!product) return notFound();

	const discountPercentage = product.onSale && product.salePrice 
		? calculateDiscountPercentage(product.price, product.salePrice)
		: null;

	// Only fetch all products if product might have varieties (check description)
	// This reduces database load for most product pages
	const needsVarieties = product.description?.includes('Also available:') || 
	                      product.description?.includes('also available:');
	const allProducts = needsVarieties ? await getAllProducts() : undefined;

	return <ProductDetailClient 
		product={product} 
		discountPercentage={discountPercentage}
		allProducts={allProducts} // Pass if needed, otherwise undefined
	/>;
}


