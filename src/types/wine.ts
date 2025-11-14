export type WineType = "Red" | "White" | "Rosé" | "Sparkling";

export interface Wine {
	slug: string;
	name: string;
	type: WineType;
	country: string;
	region?: string;
	price: number;
	description: string;
	image: string;
}




