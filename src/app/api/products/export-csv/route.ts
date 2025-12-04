import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db/products";

// Export products to CSV for Deliveroo
export async function GET() {
	try {
		const products = await getAllProducts();

		// CSV headers - include fields relevant for Deliveroo
		const headers = [
			"Name",
			"Category",
			"Price",
			"Description",
			"Country",
			"Region",
			"Producer",
			"Wine Type",
			"Spirit Type",
			"Beer Style",
			"ABV",
			"Volume (ml)",
		];

		// Convert products to CSV rows
		const rows = products.map((product) => {
			// Escape commas and quotes in CSV values
			const escapeCSV = (value: any): string => {
				if (value === null || value === undefined) return "";
				const str = String(value);
				// If contains comma, quote, or newline, wrap in quotes and escape quotes
				if (str.includes(",") || str.includes('"') || str.includes("\n")) {
					return `"${str.replace(/"/g, '""')}"`;
				}
				return str;
			};

			return [
				escapeCSV(product.name),
				escapeCSV(product.category),
				escapeCSV(product.price || 0),
				escapeCSV(product.description || ""),
				escapeCSV(product.country),
				escapeCSV(product.region || ""),
				escapeCSV(product.producer || ""),
				escapeCSV(product.wineType || ""),
				escapeCSV(product.spiritType || ""),
				escapeCSV(product.beerStyle || ""),
				escapeCSV(product.abv || ""),
				escapeCSV(product.volumeMl || ""),
			].join(",");
		});

		// Combine headers and rows
		const csvContent = [headers.join(","), ...rows].join("\n");

		// Return CSV file
		return new NextResponse(csvContent, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="wine-haven-products-${new Date().toISOString().split("T")[0]}.csv"`,
			},
		});
	} catch (error: any) {
		console.error("Error exporting products to CSV:", error);
		return NextResponse.json(
			{ error: "Failed to export products to CSV", details: error.message },
			{ status: 500 }
		);
	}
}

