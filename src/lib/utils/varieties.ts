import { Product } from "@/types/product";
import { normalizeText } from "./text";

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

/**
 * Parses variety names from product description
 * Looks for patterns like "Also available: Product1, Product2, Product3"
 */
export function parseVarietiesFromDescription(description: string): string[] {
	const varieties: string[] = [];
	
	if (!description) return varieties;
	
	// Match patterns like "Also available: Product1, Product2, Product3"
	const alsoAvailableMatch = description.match(/Also available:\s*([^\.\n]+)/i);
	if (alsoAvailableMatch) {
		const varietiesText = alsoAvailableMatch[1];
		// Split by comma and clean up
		varieties.push(
			...varietiesText
				.split(',')
				.map(v => v.trim())
				.filter(v => v.length > 0 && !v.includes('prices may differ'))
		);
	}
	
	return varieties;
}

/**
 * Finds varieties by matching product names with the same brand/base name
 * e.g., "Clonakilty" matches "Clonakilty Single Pot Still", "Clonakilty Port Cask", etc.
 */
export function findVarietiesByName(product: Product, allProducts: Product[]): Product[] {
	// Extract base name (first word, typically the brand)
	const productNameWords = product.name.split(' ');
	if (productNameWords.length < 2) return [];
	
	const productNameBase = productNameWords[0]; // e.g., "Clonakilty"
	const normalizedBase = normalizeText(productNameBase.toLowerCase());
	
	return allProducts.filter(p => {
		// Must be same category
		if (p.category !== product.category) return false;
		
		// Must be different product
		if (p.slug === product.slug) return false;
		
		// Check if product name starts with the same base
		const pNameWords = p.name.split(' ');
		if (pNameWords.length < 2) return false;
		
		const pNameBase = pNameWords[0];
		const pNormalizedBase = normalizeText(pNameBase.toLowerCase());
		
		return pNormalizedBase === normalizedBase;
	});
}

/**
 * Enhanced function that finds varieties using multiple methods:
 * 1. Volume-based (same name, different sizes) - PRIORITY: Most accurate
 * 2. Description-based (products mentioned in "Also available:") - PRIORITY: User-specified
 * 3. Name-based (same brand, different expressions) - FALLBACK: Only if no other matches
 * 
 * STRICT MODE: Only shows true varieties (sizes/expressions), not unrelated products
 */
export function findProductVarietiesEnhanced(product: Product, allProducts: Product[]): Product[] {
	const varieties: Product[] = [];
	const existingSlugs = new Set<string>([product.slug]);
	
	// Method 1: Volume-based (same name, different sizes) - MOST ACCURATE
	// This finds products like "Jameson 700ml" and "Jameson 1L"
	const volumeVarieties = findProductVarieties(product, allProducts);
	volumeVarieties.forEach(v => {
		if (!existingSlugs.has(v.slug)) {
			varieties.push(v);
			existingSlugs.add(v.slug);
		}
	});
	
	// Method 2: Description-based - parse "Also available:" mentions - USER-SPECIFIED
	// This uses the varieties you explicitly list in product descriptions
	const describedVarieties = parseVarietiesFromDescription(product.description || '');
	if (describedVarieties.length > 0) {
		describedVarieties.forEach(varietyName => {
			// Try to find products that match this variety name EXACTLY
			const matchedProducts = allProducts.filter(p => {
				if (p.slug === product.slug || existingSlugs.has(p.slug)) return false;
				if (p.category !== product.category) return false;
				
				// STRICT MATCHING: Product name must contain the variety name
				// e.g., "Clonakilty Single Pot Still" matches "Clonakilty Single Pot Still"
				const normalizedVariety = normalizeText(varietyName.toLowerCase().trim());
				const normalizedProduct = normalizeText(p.name.toLowerCase());
				
				// Extract meaningful words from variety name (skip common words)
				const varietyWords = varietyName
					.split(' ')
					.map(w => w.trim())
					.filter(w => 
						w.length > 2 && 
						!['the', 'and', 'or', 'of', 'in', 'on', 'at', 'irish', 'whiskey', 'whisky'].includes(w.toLowerCase())
					);
				
				// Must match at least 2 meaningful words OR the full variety name
				if (varietyWords.length === 0) return false;
				
				// Check if product name contains the full variety name OR at least 2 key words
				const fullMatch = normalizedProduct.includes(normalizedVariety);
				const wordMatches = varietyWords.filter(word => {
					const normalizedWord = normalizeText(word.toLowerCase());
					return normalizedProduct.includes(normalizedWord);
				});
				
				// Require at least 2 word matches OR full match
				return fullMatch || wordMatches.length >= Math.min(2, varietyWords.length);
			});
			
			matchedProducts.forEach(matched => {
				if (!existingSlugs.has(matched.slug)) {
					varieties.push(matched);
					existingSlugs.add(matched.slug);
				}
			});
		});
	}
	
	// Method 3: Name-based (same brand, different expressions) - FALLBACK ONLY
	// Only use this if we haven't found any varieties yet (to avoid showing unrelated products)
	// AND only if the product name suggests it's part of a series (has multiple words)
	if (varieties.length === 0) {
		const productNameWords = product.name.split(' ').filter(w => w.length > 0);
		// Only use name-based matching if product name has 3+ words (suggests it's part of a series)
		// e.g., "Clonakilty Galley Head" (3 words) vs "Jameson" (1 word)
		if (productNameWords.length >= 3) {
			const nameVarieties = findVarietiesByName(product, allProducts);
			// Further filter: only include if they share at least 2 words (not just brand)
			const filteredNameVarieties = nameVarieties.filter(v => {
				const vWords = v.name.split(' ').filter(w => w.length > 0);
				const sharedWords = productNameWords.filter(pw => 
					vWords.some(vw => normalizeText(pw.toLowerCase()) === normalizeText(vw.toLowerCase()))
				);
				// Must share at least 2 words (brand + at least one other word)
				return sharedWords.length >= 2;
			});
			
			filteredNameVarieties.forEach(v => {
				if (!existingSlugs.has(v.slug)) {
					varieties.push(v);
					existingSlugs.add(v.slug);
				}
			});
		}
	}
	
	return varieties;
}

/**
 * Enhanced check for multiple varieties
 */
export function hasMultipleVarietiesEnhanced(product: Product, allProducts: Product[]): boolean {
	const varieties = findProductVarietiesEnhanced(product, allProducts);
	return varieties.length > 0;
}


