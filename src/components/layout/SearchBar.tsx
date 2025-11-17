"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

export function SearchBar() {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Product[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Close search when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setQuery("");
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			// Focus input when opened
			setTimeout(() => inputRef.current?.focus(), 100);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Helper to normalize for ranking (diacritics-insensitive)
	const normalize = (s?: string) =>
		(s || "")
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "");

	// Debounced search
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setIsSearching(true);
			try {
				const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
				if (response.ok) {
					const data = await response.json();
					const productsArray: Product[] = Array.isArray(data) ? data : (data.products || []);

					// Rank results so the most relevant matches appear first
					// API already filters, so we just rank and limit results
					const qNorm = normalize(query.trim());
					const qWords = qNorm.split(/\s+/).filter(Boolean);
					
					const scored = productsArray.map((p) => {
						const name = normalize(p.name);
						const slug = normalize(p.slug);
						const country = normalize(p.country);
						const region = normalize(p.region);
						const producer = normalize(p.producer);
						const grapes = normalize((p.grapes || []).join(', '));
						const description = normalize(p.description);

						let score = 0;
						
						// Check each word in the query
						for (const word of qWords) {
							// Strong boost for name starting with word
							if (name.startsWith(word)) score += 100;
							else if (name.includes(word)) score += 70;
							
							// Strong boost for region match (Rioja, Bordeaux, Côtes du Rhône, etc.)
							if (region.includes(word)) score += 80;
							
							// Boost for producer match
							if (producer.includes(word)) score += 60;
							
							// Boost for grapes match
							if (grapes.includes(word)) score += 50;
							
							// Smaller boosts for other fields
							if (slug.includes(word)) score += 20;
							if (country.includes(word)) score += 15;
							if (description.includes(word)) score += 10;
						}

						return { product: p, score };
					});

					scored.sort((a, b) => b.score - a.score);
					
					// Show top 8 results (API already filtered, so we trust the results)
					setResults(
						scored
							.slice(0, 8)
							.map((s) => s.product)
					);
				}
			} catch (error) {
				console.error("Search error:", error);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			window.location.href = `/shop?search=${encodeURIComponent(query)}`;
		}
	};

	return (
		<div ref={searchRef} className="relative">
			{/* Search Icon Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative w-10 h-10 rounded-full bg-maroon/10 hover:bg-maroon/20 flex items-center justify-center text-maroon transition-colors"
				aria-label="Search products"
			>
				<Search size={18} />
			</button>

			{/* Search Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="absolute right-0 top-full mt-2 w-[400px] rounded-lg border border-maroon/20 bg-white shadow-xl z-50"
					>
						<form onSubmit={handleSubmit} className="p-4 border-b border-maroon/10">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon/40" size={18} />
								<input
									ref={inputRef}
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Search wines, spirits, beers..."
									className="w-full pl-10 pr-10 py-2 rounded-md border border-maroon/20 bg-white text-sm outline-none focus:border-gold"
								/>
								{query && (
									<button
										type="button"
										onClick={() => setQuery("")}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon/40 hover:text-maroon"
									>
										<X size={16} />
									</button>
								)}
							</div>
						</form>

						{/* Search Results */}
						<div className="max-h-[400px] overflow-y-auto">
							{isSearching ? (
								<div className="p-8 text-center text-maroon/60 text-sm">Searching...</div>
							) : query.trim() && results.length === 0 ? (
								<div className="p-8 text-center text-maroon/60 text-sm">
									No products found for "{query}"
								</div>
							) : results.length > 0 ? (
								<div className="p-2">
									{results.map((product) => (
										<Link
											key={product.slug}
											href={`/product/${product.slug}`}
											onClick={() => {
												setIsOpen(false);
												setQuery("");
											}}
											className="flex items-center gap-3 p-3 rounded-md hover:bg-soft-gray transition-colors group"
										>
											<div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-soft-gray">
												<Image
													src={product.image}
													alt={product.name}
													fill
													className="object-cover group-hover:scale-105 transition-transform"
													sizes="64px"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-maroon truncate group-hover:text-gold transition-colors">
													{product.name}
												</p>
												<p className="text-xs text-maroon/60">
													{product.category} {product.country && `• ${product.country}`}
												</p>
												<p className="text-sm font-semibold text-maroon mt-1">
													€{product.onSale && product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
												</p>
											</div>
										</Link>
									))}
									{query.trim() && (
										<Link
											href={`/shop?search=${encodeURIComponent(query)}`}
											onClick={() => {
												setIsOpen(false);
												setQuery("");
											}}
											className="block p-3 text-center text-sm text-gold hover:bg-soft-gray transition-colors border-t border-maroon/10"
										>
											View all results for "{query}"
										</Link>
									)}
								</div>
							) : (
								<div className="p-8 text-center text-maroon/60 text-sm">
									Start typing to search...
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

