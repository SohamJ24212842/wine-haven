export type ProductCategory = "Wine" | "Beer" | "Spirit";

export type WineType = "Red" | "White" | "Rosé" | "Sparkling";
export type SpiritType = "Gin" | "Vodka" | "Rum" | "Tequila" | "Liqueur" | "Whiskey";
export type BeerStyle = "Lager" | "IPA" | "Pale Ale" | "Stout" | "Porter" | "Pilsner" | "Sour";

export interface Product {
	slug: string;
	category: ProductCategory;
	name: string;
	price: number;
	description: string;
	image: string;
	country: string;
	region?: string;
	// Specific attributes per category (optional)
	wineType?: WineType;
	spiritType?: SpiritType;
	beerStyle?: BeerStyle;
	abv?: number;
	volumeMl?: number;
	// Admin flags
	featured?: boolean;
	new?: boolean;
	onSale?: boolean;
	salePrice?: number;
	stock?: number;
	christmasGift?: boolean;
}


