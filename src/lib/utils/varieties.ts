import { Product } from "@/types/product";

/**
 * Normalizes a product name by removing volume information (e.g., "500ml", "700ml", "1L")
 * This helps identify products that are the same but in different sizes
 */
export function normalizeProductName(name: string): string {
	// Remove common volume patterns: 500ml, 700ml, 1L, 750ml, etc.
	// Also remove trailing spaces and common separators
	return name
		.replace(/\s*\d+\s*(ml|mL|ML|L|l)\s*/gi, "")
		.replace(/\s*-\s*$/, "")
		.replace(/\s+$/, "")
		.trim();
}

/**
 * Groups products by their normalized name to find products with multiple varieties
 */
export function groupProductsByVarieties(products: Product[]): Map<string, Product[]> {
	const groups = new Map<string, Product[]>();
	
	for (const product of products) {
		const normalizedName = normalizeProductName(product.name);
		if (!groups.has(normalizedName)) {
			groups.set(normalizedName, []);
		}
		groups.get(normalizedName)!.push(product);
	}
	
	return groups;
}

/**
 * Finds all varieties of a given product (products with the same normalized name)
 */
export function findProductVarieties(product: Product, allProducts: Product[]): Product[] {
	const normalizedName = normalizeProductName(product.name);
	return allProducts.filter(p => 
		normalizeProductName(p.name) === normalizedName &&
		p.slug !== product.slug // Exclude the current product itself
	);
}

/**
 * Checks if a product has multiple varieties (same name, different sizes/prices)
 */
export function hasMultipleVarieties(product: Product, allProducts: Product[]): boolean {
	const varieties = findProductVarieties(product, allProducts);
	return varieties.length > 0;
}

/**
 * Gets all varieties including the current product
 */
export function getAllVarieties(product: Product, allProducts: Product[]): Product[] {
	const normalizedName = normalizeProductName(product.name);
	return allProducts.filter(p => normalizeProductName(p.name) === normalizedName);
}

