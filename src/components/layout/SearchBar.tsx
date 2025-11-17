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


	// Helper to normalize text (remove diacritics) - same as shop page
	const normalize = (s?: string) =>
		(s || "")
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "");

	// Debounced search - filter locally exactly like shop page
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setIsSearching(true);
			try {
				// Fetch all products and filter locally (same as shop page)
				const response = await fetch('/api/products');
				if (response.ok) {
					const data = await response.json();
					const productsArray: Product[] = Array.isArray(data) ? data : (data.products || []);

					// Filter locally with normalization (exactly like shop page)
					const q = normalize(query.trim());
					const filtered = productsArray.filter((p) => {
						return (
							normalize(p.name).includes(q) ||
							normalize(p.slug).includes(q) ||
							normalize(p.country).includes(q) ||
							normalize(p.region).includes(q) ||
							normalize(p.description).includes(q) ||
							normalize(p.producer).includes(q) ||
							normalize(p.tasteProfile).includes(q) ||
							normalize(p.foodPairing).includes(q) ||
							normalize((p.grapes || []).join(", ")).includes(q)
						);
					});

					setResults(filtered.slice(0, 8));
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
						className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[72px] sm:top-full mt-2 w-auto sm:w-[400px] sm:max-w-[400px] rounded-lg border border-maroon/20 bg-white shadow-xl z-50"
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

