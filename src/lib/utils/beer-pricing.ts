import { Product } from "@/types/product";

// List of specific beer brands that should show "each" prefix
const BEER_BRANDS_WITH_EACH = [
	"Desperado",
	"Desparado", // Alternative spelling
	"Erdinger",
	"Peroni",
	"Galway Bay",
	"Wicklow Wolf",
	"Dew Drop",
	"La Chouffee",
	"Chouffee",
	"Thatchers",
	"Kinnegar"
];

/**
 * Check if a product is one of the specific beers that should show "each" prefix
 * Only these specific beer brands should show "each" in front of their prices
 */
export function shouldShowEachForBeer(product: Product): boolean {
	if (product.category !== "Beer") return false;
	
	const productName = product.name.toLowerCase();
	return BEER_BRANDS_WITH_EACH.some(brand => 
		productName.includes(brand.toLowerCase())
	);
}

