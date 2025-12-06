import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db/products";

// Debug endpoint to check if a product exists by slug
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const slug = searchParams.get("slug");

	if (!slug) {
		return NextResponse.json(
			{ error: "Slug parameter is required" },
			{ status: 400 }
		);
	}

	try {
		const product = await getProductBySlug(slug);
		
		if (!product) {
			return NextResponse.json({
				exists: false,
				slug: slug,
				message: `Product with slug "${slug}" not found`,
			});
		}

		return NextResponse.json({
			exists: true,
			slug: slug,
			product: {
				name: product.name,
				slug: product.slug,
				category: product.category,
				price: product.price,
			},
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				exists: false,
				slug: slug,
				error: error.message || "Unknown error",
			},
			{ status: 500 }
		);
	}
}

