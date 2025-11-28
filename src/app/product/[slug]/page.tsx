import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/db/products";
import { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProductBySlug(slug);
	return {
		title: product ? `${product.name} | Wine Haven` : "Product | Wine Haven",
	};
}

function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
	return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export default async function ProductDetailPage({ params }: { params: Params }) {
	const { slug } = await params;
	
	// Fetch product first - we only need all products if we need to find varieties
	// This reduces database load for most product pages
	const product = await getProductBySlug(slug);
	
	if (!product) return notFound();

	const discountPercentage = product.onSale && product.salePrice 
		? calculateDiscountPercentage(product.price, product.salePrice)
		: null;

	// Only fetch all products if needed for variety detection
	// This is done lazily in the client component to reduce server load
	return <ProductDetailClient 
		product={product} 
		discountPercentage={discountPercentage}
		allProducts={undefined} // Let client fetch if needed
	/>;
}


