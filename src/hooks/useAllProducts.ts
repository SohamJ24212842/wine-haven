"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { products as localProducts } from "@/data/products";

/**
 * Hook to fetch all products (for variety detection)
 * Uses API with fallback to local data
 */
export function useAllProducts(): Product[] {
	const [products, setProducts] = useState<Product[]>(localProducts);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("/api/products");
				if (response.ok) {
					const data = await response.json();
					const productsArray = Array.isArray(data) ? data : (data.products || []);
					if (productsArray.length > 0) {
						setProducts(productsArray);
					}
				}
			} catch (err) {
				console.error("Failed to fetch products for variety detection:", err);
				// Keep local products as fallback
			}
		};

		fetchProducts();
	}, []);

	return products;
}






