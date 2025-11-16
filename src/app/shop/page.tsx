"use client";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { useMemo, useState, useEffect, Suspense, useRef } from "react";
import { ProductCategory, BeerStyle, SpiritType, WineType, Product } from "@/types/product";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wine, Beer, Sparkles, MapPin, Filter, X, Tag } from "lucide-react";
import { products as localProducts } from "@/data/products";

const compulsoryCategories: ProductCategory[] = ["Wine", "Beer", "Spirit"];

function ShopPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch products from database with fallback to local data
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				// Check if there's a search query in URL
				const searchQuery = searchParams.get("search") || searchParams.get("q");
				const url = searchQuery ? `/api/products?search=${encodeURIComponent(searchQuery)}` : '/api/products';
				
				const response = await fetch(url);
				if (response.ok) {
					const data = await response.json();
					// API returns array directly, not wrapped in {products}
					const productsArray = Array.isArray(data) ? data : (data.products || []);
					setProducts(productsArray.length > 0 ? productsArray : localProducts);
				} else {
					// Fallback to local data if API fails
					console.warn('API failed, using local data');
					setProducts(localProducts);
				}
			} catch (err) {
				console.error('Failed to fetch products:', err);
				// Fallback to local data
				setProducts(localProducts);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [searchParams]);

	// Memoize regions, countries, and price calculations
	const regions = useMemo(() => Array.from(new Set(products.map((p) => p.region).filter(Boolean))) as string[], [products]);
	const countries = useMemo(() => Array.from(new Set(products.map((p) => p.country).filter(Boolean))) as string[], [products]);
	const wineTypes = useMemo(() => {
		const base = Array.from(
			new Set(products.filter((p) => p.wineType).map((p) => p.wineType!))
		) as WineType[];

		// Always show Prosecco first as a quick filter, even if there are
		// currently no Prosecco products (it will just show 0 results).
		if (base.includes("Prosecco")) {
			return (["Prosecco", ...base.filter((t) => t !== "Prosecco")] as WineType[]);
		}
		return (["Prosecco", ...base] as WineType[]);
	}, [products]);
	const spiritTypes = useMemo(() => Array.from(new Set(products.filter(p => p.spiritType).map(p => p.spiritType!))) as SpiritType[], [products]);
	const beerStyles = useMemo(() => Array.from(new Set(products.filter(p => p.beerStyle).map(p => p.beerStyle!))) as BeerStyle[], [products]);
	
	// Memoize price calculations to keep dependency array stable
	const prices = useMemo(() => products.map((p) => p.onSale && p.salePrice ? p.salePrice : p.price), [products]);
	const minAvailable = useMemo(() => prices.length > 0 ? Math.floor(Math.min(...prices)) : 0, [prices]);
	const maxAvailable = useMemo(() => prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000, [prices]);

	// Helper function to parse URL params
	const parseUrlParams = () => {
		return {
			query: searchParams.get("q") || searchParams.get("search") || "",
			wineTypes: (searchParams.get("wineType")?.split(",").filter(Boolean) as WineType[]) || [],
			spiritTypes: (searchParams.get("spiritType")?.split(",").filter(Boolean) as SpiritType[]) || [],
			beerStyles: (searchParams.get("beerStyle")?.split(",").filter(Boolean) as BeerStyle[]) || [],
			regions: searchParams.get("region")?.split(",").filter(Boolean) || [],
			countries: searchParams.get("country")?.split(",").filter(Boolean) || [],
			minPrice: Number(searchParams.get("minPrice")) || minAvailable,
			maxPrice: Number(searchParams.get("maxPrice")) || maxAvailable,
			sortBy: searchParams.get("sort") || "featured",
			category: (searchParams.get("category") as ProductCategory) || "All",
			christmasGift: searchParams.get("christmasGift") === "true",
			onSale: searchParams.get("onSale") === "true",
			new: searchParams.get("new") === "true",
		};
	};

	// Initialize state from URL params
	const [query, setQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [selectedWineTypes, setSelectedWineTypes] = useState<WineType[]>([]);
	const [selectedSpiritTypes, setSelectedSpiritTypes] = useState<SpiritType[]>([]);
	const [selectedBeerStyles, setSelectedBeerStyles] = useState<BeerStyle[]>([]);
	const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
	const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
	const [minPrice, setMinPrice] = useState<number>(minAvailable);
	const [maxPrice, setMaxPrice] = useState<number>(maxAvailable);
	const [sortBy, setSortBy] = useState<string>("featured");
	const [activeCategoryTab, setActiveCategoryTab] = useState<ProductCategory | "All">("All");
	const [christmasGift, setChristmasGift] = useState<boolean>(false);
	const [onSale, setOnSale] = useState<boolean>(false);
	const [newOnly, setNewOnly] = useState<boolean>(false);

	// Hydrate state from URL params ONCE (initial load)
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current) return;
		if (products.length === 0 || minAvailable === 0 || maxAvailable === 0) return; // Wait for products to load
		const params = parseUrlParams();
		setQuery(params.query);
		setSelectedWineTypes(params.wineTypes);
		setSelectedSpiritTypes(params.spiritTypes);
		setSelectedBeerStyles(params.beerStyles);
		setSelectedRegions(params.regions);
		setSelectedCountries(params.countries);
		// Only update price if URL has explicit values, otherwise use defaults
		setMinPrice(searchParams.get("minPrice") ? params.minPrice : minAvailable);
		setMaxPrice(searchParams.get("maxPrice") ? params.maxPrice : maxAvailable);
		setSortBy(params.sortBy);
		setActiveCategoryTab(params.category);
		setChristmasGift(params.christmasGift);
		setOnSale(params.onSale);
		setNewOnly(params.new);
		hydratedRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, products.length, minAvailable, maxAvailable]);

	// React to URL changes after navigation (but don't override when typing)
	useEffect(() => {
		if (!hydratedRef.current) return;
		if (isTyping) return;
		const params = parseUrlParams();
		setQuery(params.query);
		setSelectedWineTypes(params.wineTypes);
		setSelectedSpiritTypes(params.spiritTypes);
		setSelectedBeerStyles(params.beerStyles);
		setSelectedRegions(params.regions);
		setSelectedCountries(params.countries);
		setMinPrice(searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : minAvailable);
		setMaxPrice(searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : maxAvailable);
		setSortBy(params.sortBy);
		setActiveCategoryTab(params.category);
		setChristmasGift(params.christmasGift);
		setOnSale(params.onSale);
		setNewOnly(params.new);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, isTyping, minAvailable, maxAvailable]);

	// Update min/max price when products load (only if not set from URL)
	useEffect(() => {
		if (products.length > 0 && minAvailable > 0 && maxAvailable > 0) {
			// Only update if prices haven't been set from URL params
			if (!searchParams.get("minPrice") && (minPrice === 0 || minPrice < minAvailable)) {
				setMinPrice(minAvailable);
			}
			if (!searchParams.get("maxPrice") && (maxPrice === 1000 || maxPrice > maxAvailable)) {
				setMaxPrice(maxAvailable);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products.length, minAvailable, maxAvailable]);

	// Debounced URL update to prevent excessive re-renders
	useEffect(() => {
		// Don't overwrite incoming URL filters until we've hydrated from them once
		if (!hydratedRef.current) return;
		const timeoutId = setTimeout(() => {
			const params = new URLSearchParams();
			if (query) params.set("q", query);
			if (selectedWineTypes.length) params.set("wineType", selectedWineTypes.join(","));
			if (selectedSpiritTypes.length) params.set("spiritType", selectedSpiritTypes.join(","));
			if (selectedBeerStyles.length) params.set("beerStyle", selectedBeerStyles.join(","));
			if (selectedRegions.length) params.set("region", selectedRegions.join(","));
			if (selectedCountries.length) params.set("country", selectedCountries.join(","));
			if (minPrice !== minAvailable && minPrice > 0) params.set("minPrice", minPrice.toString());
			if (maxPrice !== maxAvailable && maxPrice < 10000) params.set("maxPrice", maxPrice.toString());
			if (sortBy !== "featured") params.set("sort", sortBy);
			if (activeCategoryTab !== "All") params.set("category", activeCategoryTab);
			if (christmasGift) params.set("christmasGift", "true");
			if (onSale) params.set("onSale", "true");
			if (newOnly) params.set("new", "true");

			const newUrl = params.toString() ? `?${params.toString()}` : "/shop";
			router.replace(newUrl, { scroll: false });
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [query, selectedWineTypes, selectedSpiritTypes, selectedBeerStyles, selectedRegions, selectedCountries, minPrice, maxPrice, sortBy, activeCategoryTab, christmasGift, onSale, newOnly, router, minAvailable, maxAvailable]);

	// Get category counts
	const categoryCounts = useMemo(() => {
		const all = products.length;
		const wine = products.filter((p) => p.category === "Wine").length;
		const beer = products.filter((p) => p.category === "Beer").length;
		const spirit = products.filter((p) => p.category === "Spirit").length;
		return { all, wine, beer, spirit };
	}, []);

	const filteredSorted = useMemo(() => {
		const normalize = (s?: string) =>
			(s || "")
				.toLowerCase()
				.normalize("NFD")
				.replace(/\p{Diacritic}/gu, "");

		let filtered = products.filter((p) => {
			// Category filter
			if (activeCategoryTab !== "All" && p.category !== activeCategoryTab) return false;

			// Christmas Gift filter
			if (christmasGift && !p.christmasGift) return false;

			// On Sale filter
			if (onSale && !p.onSale) return false;

			// New filter
			if (newOnly && !p.new) return false;

			// Country filter
			if (selectedCountries.length > 0 && !selectedCountries.includes(p.country)) return false;

			const q = normalize(query.trim());
			const matchesQuery =
				q.length === 0 ||
				normalize(p.name).includes(q) ||
				normalize(p.slug).includes(q) ||
				normalize(p.country).includes(q) ||
				normalize(p.region).includes(q) ||
				normalize(p.description).includes(q) ||
				normalize(p.producer).includes(q) ||
				normalize(p.tasteProfile).includes(q) ||
				normalize(p.foodPairing).includes(q) ||
				normalize((p.grapes || []).join(", ")).includes(q);

			const matchesWineType =
				p.category !== "Wine" || selectedWineTypes.length === 0 || (p.wineType ? selectedWineTypes.includes(p.wineType) : false);
			const matchesSpiritType =
				p.category !== "Spirit" || selectedSpiritTypes.length === 0 || (p.spiritType ? selectedSpiritTypes.includes(p.spiritType) : false);
			const matchesBeerStyle =
				p.category !== "Beer" || selectedBeerStyles.length === 0 || (p.beerStyle ? selectedBeerStyles.includes(p.beerStyle) : false);

			const matchesRegion = selectedRegions.length === 0 || (p.region ? selectedRegions.includes(p.region) : false);
			
			// Price filter - use sale price if on sale
			const productPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
			const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

			return (
				matchesQuery &&
				matchesWineType &&
				matchesSpiritType &&
				matchesBeerStyle &&
				matchesRegion &&
				matchesPrice
			);
		});

		switch (sortBy) {
			case "price-asc":
				return [...filtered].sort((a, b) => {
					const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
					const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
					return priceA - priceB;
				});
			case "price-desc":
				return [...filtered].sort((a, b) => {
					const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
					const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
					return priceB - priceA;
				});
			case "name-asc":
				return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
			case "name-desc":
				return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
			default:
				return filtered;
		}
	}, [query, selectedWineTypes, selectedSpiritTypes, selectedBeerStyles, selectedRegions, selectedCountries, minPrice, maxPrice, sortBy, activeCategoryTab, christmasGift, onSale, newOnly, products]);

	const clearAll = () => {
		setQuery("");
		setSelectedWineTypes([]);
		setSelectedSpiritTypes([]);
		setSelectedBeerStyles([]);
		setSelectedRegions([]);
		setSelectedCountries([]);
		setMinPrice(minAvailable);
		setMaxPrice(maxAvailable);
		setSortBy("featured");
		setActiveCategoryTab("All");
		setChristmasGift(false);
		setOnSale(false);
		setNewOnly(false);
	};

	const hasActiveFilters =
		selectedRegions.length ||
		selectedCountries.length ||
		selectedWineTypes.length ||
		selectedSpiritTypes.length ||
		selectedBeerStyles.length ||
		query ||
		minPrice !== minAvailable ||
		maxPrice !== maxAvailable ||
		activeCategoryTab !== "All" ||
		christmasGift ||
		onSale ||
		newOnly;

	if (loading) {
		return (
			<Container className="py-12">
				<SectionHeading>Shop</SectionHeading>
				<div className="mt-8 text-center text-maroon/60">Loading products...</div>
			</Container>
		);
	}

	return (
		<div className="min-h-screen" style={{ scrollBehavior: "smooth" }}>
			<Container className="py-12">
				<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
				<SectionHeading subtitle="Browse our curated selection">Shop</SectionHeading>
				</motion.div>

			{/* ROW 1 — Category Chips */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="mt-8 flex flex-wrap gap-3"
			>
				{(["All", "Wine", "Beer", "Spirit"] as const).map((cat) => {
					const isActive = activeCategoryTab === cat;
					return (
						<button
							key={cat}
							onClick={() => setActiveCategoryTab(cat)}
							className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
								isActive
									? "border-maroon/30 bg-maroon/5 text-maroon font-medium"
									: "border-maroon/20 bg-white text-maroon/70 hover:bg-soft-gray"
							}`}
						>
							{cat === "Wine" && <Wine size={16} />}
							{cat === "Beer" && <Beer size={16} />}
							{cat === "Spirit" && <Sparkles size={16} />}
							{cat === "All" && <Filter size={16} />}
							<span>{cat}</span>
						</button>
					);
				})}
			</motion.div>

			{/* ROW 2 — Search + Sort */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.05 }}
				className="mt-6 flex flex-col md:flex-row md:items-center gap-4"
			>
				<input
					type="text"
					placeholder="Search by name, country, region, producer, food…"
					className="flex-1 rounded-full border border-maroon/20 bg-white px-4 py-2 outline-none focus:border-maroon/40 transition-colors"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsTyping(true)}
					onBlur={() => setIsTyping(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter") e.preventDefault();
					}}
				/>
					<select
					className="w-full md:w-64 rounded-full border border-maroon/20 bg-white px-4 py-2 outline-none focus:border-maroon/40 transition-colors"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<option value="featured">Sort: Featured</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="name-asc">Name: A → Z</option>
						<option value="name-desc">Name: Z → A</option>
					</select>
			</motion.div>

			{/* ROW 3 — Collapsible Advanced Filters */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
				className="mt-4"
			>
				<AdvancedFilters
					minAvailable={minAvailable}
					maxAvailable={maxAvailable}
					minPrice={minPrice}
					maxPrice={maxPrice}
					setMinPrice={setMinPrice}
					setMaxPrice={setMaxPrice}
					regions={regions}
					selectedRegions={selectedRegions}
					setSelectedRegions={setSelectedRegions}
					wineTypes={wineTypes}
					selectedWineTypes={selectedWineTypes}
					setSelectedWineTypes={setSelectedWineTypes}
					spiritTypes={spiritTypes}
					selectedSpiritTypes={selectedSpiritTypes}
					setSelectedSpiritTypes={setSelectedSpiritTypes}
					beerStyles={beerStyles}
					selectedBeerStyles={selectedBeerStyles}
					setSelectedBeerStyles={setSelectedBeerStyles}
				/>
			</motion.div>

			{/* Active filter chips */}
			{hasActiveFilters && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="mt-6 flex flex-wrap items-center gap-1.5"
				>
					{selectedCountries.map((c) => (
						<button
							key={`country-${c}`}
							onClick={() => setSelectedCountries((prev) => prev.filter((x) => x !== c))}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<MapPin size={10} />
							{c}
							<X size={10} />
						</button>
					))}
					{selectedRegions.map((r) => (
						<button
							key={`reg-${r}`}
							onClick={() => setSelectedRegions((prev) => prev.filter((x) => x !== r))}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<MapPin size={10} />
							{r}
							<X size={10} />
						</button>
					))}
					{selectedWineTypes.map((t) => (
						<button
							key={`wine-${t}`}
							onClick={() => setSelectedWineTypes((prev) => prev.filter((x) => x !== t))}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Wine size={10} />
							Wine: {t}
							<X size={10} />
						</button>
					))}
					{selectedSpiritTypes.map((t) => (
						<button
							key={`spirit-${t}`}
							onClick={() => setSelectedSpiritTypes((prev) => prev.filter((x) => x !== t))}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Sparkles size={10} />
							Spirit: {t}
							<X size={10} />
						</button>
					))}
					{selectedBeerStyles.map((t) => (
						<button
							key={`beer-${t}`}
							onClick={() => setSelectedBeerStyles((prev) => prev.filter((x) => x !== t))}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Beer size={10} />
							Beer: {t}
							<X size={10} />
						</button>
					))}
					{christmasGift && (
						<button
							onClick={() => setChristmasGift(false)}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Sparkles size={10} />
							Christmas Gifts
							<X size={10} />
						</button>
					)}
					{onSale && (
						<button
							onClick={() => setOnSale(false)}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Tag size={10} />
							On Sale
							<X size={10} />
						</button>
					)}
					{newOnly && (
						<button
							onClick={() => setNewOnly(false)}
							className="flex items-center gap-1 rounded-full border border-maroon/20 bg-white px-2.5 py-0.5 text-[11px] hover:bg-soft-gray transition-colors"
							type="button"
						>
							<Sparkles size={10} />
							New
							<X size={10} />
						</button>
					)}
					<button
						onClick={clearAll}
						className="ml-2 flex items-center gap-1 text-[11px] text-maroon/70 underline hover:text-maroon transition-colors"
						type="button"
					>
						<X size={12} />
						Clear all
					</button>
				</motion.div>
			)}

			{/* Results count */}
			<motion.div className="mt-8 text-sm text-maroon/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				Showing {filteredSorted.length} {filteredSorted.length === 1 ? "product" : "products"}
			</motion.div>

			{/* Product Grid */}
			<motion.div
				className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.35 }}
			>
				{filteredSorted.map((product) => (
					<ProductCard key={product.slug} product={product} />
				))}
			</motion.div>
			</Container>
		</div>
	);
}

// Collapsible Advanced Filters component
function AdvancedFilters({
	minAvailable,
	maxAvailable,
	minPrice,
	maxPrice,
	setMinPrice,
	setMaxPrice,
	regions,
	selectedRegions,
	setSelectedRegions,
	wineTypes,
	selectedWineTypes,
	setSelectedWineTypes,
	spiritTypes,
	selectedSpiritTypes,
	setSelectedSpiritTypes,
	beerStyles,
	selectedBeerStyles,
	setSelectedBeerStyles,
}: {
	minAvailable: number;
	maxAvailable: number;
	minPrice: number;
	maxPrice: number;
	setMinPrice: (v: number) => void;
	setMaxPrice: (v: number) => void;
	regions: string[];
	selectedRegions: string[];
	setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
	wineTypes: WineType[];
	selectedWineTypes: WineType[];
	setSelectedWineTypes: React.Dispatch<React.SetStateAction<WineType[]>>;
	spiritTypes: SpiritType[];
	selectedSpiritTypes: SpiritType[];
	setSelectedSpiritTypes: React.Dispatch<React.SetStateAction<SpiritType[]>>;
	beerStyles: BeerStyle[];
	selectedBeerStyles: BeerStyle[];
	setSelectedBeerStyles: React.Dispatch<React.SetStateAction<BeerStyle[]>>;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="rounded-xl border border-maroon/20 bg-white/60">
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-maroon hover:bg-soft-gray rounded-t-xl transition-colors"
				aria-expanded={open}
			>
				<span>Advanced Filters</span>
				<span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
			</button>

			{open && (
				<div className="p-4 grid gap-6">
					{/* Price */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="flex flex-col">
							<label className="text-sm text-maroon/70">Min Price: €{minPrice}</label>
							<input
								type="range"
								min={minAvailable}
								max={maxAvailable}
								value={minPrice}
								onChange={(e) => setMinPrice(Number(e.target.value))}
								className="accent-maroon"
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-sm text-maroon/70">Max Price: €{maxPrice}</label>
							<input
								type="range"
								min={minAvailable}
								max={maxAvailable}
								value={maxPrice}
								onChange={(e) => setMaxPrice(Number(e.target.value))}
								className="accent-maroon"
							/>
						</div>
					</div>

					{/* Wine Types */}
					{wineTypes.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-maroon">Wine Types</p>
							<div className="flex flex-wrap gap-2">
								{wineTypes.map((t) => {
									const active = selectedWineTypes.includes(t);
									return (
										<button
											key={t}
											onClick={() =>
												setSelectedWineTypes((prev) =>
													prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
												)
											}
											className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
												active
													? "border-maroon/30 bg-maroon/5 text-maroon"
													: "border-maroon/20 bg-white text-maroon/70 hover:bg-soft-gray"
											}`}
											type="button"
										>
											<Wine size={12} />
											{t}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Spirit Types */}
					{spiritTypes.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-maroon">Spirit Types</p>
							<div className="flex flex-wrap gap-2">
								{spiritTypes.map((t) => {
									const active = selectedSpiritTypes.includes(t);
									return (
										<button
											key={t}
											onClick={() =>
												setSelectedSpiritTypes((prev) =>
													prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
												)
											}
											className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
												active
													? "border-maroon/30 bg-maroon/5 text-maroon"
													: "border-maroon/20 bg-white text-maroon/70 hover:bg-soft-gray"
											}`}
											type="button"
										>
											<Sparkles size={12} />
											{t}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Beer Styles */}
					{beerStyles.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-maroon">Beer Styles</p>
							<div className="flex flex-wrap gap-2">
								{beerStyles.map((t) => {
									const active = selectedBeerStyles.includes(t);
									return (
										<button
											key={t}
											onClick={() =>
												setSelectedBeerStyles((prev) =>
													prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
												)
											}
											className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
												active
													? "border-maroon/30 bg-maroon/5 text-maroon"
													: "border-maroon/20 bg-white text-maroon/70 hover:bg-soft-gray"
											}`}
											type="button"
										>
											<Beer size={12} />
											{t}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Regions */}
					{regions.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-maroon">Regions</p>
							<div className="flex flex-wrap gap-2">
								{regions.map((r) => {
									const active = selectedRegions.includes(r);
									return (
										<button
											key={r}
											onClick={() =>
												setSelectedRegions((prev) =>
													prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
												)
											}
											className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
												active
													? "border-maroon/30 bg-maroon/5 text-maroon"
													: "border-maroon/20 bg-white text-maroon/70 hover:bg-soft-gray"
											}`}
											type="button"
										>
											<MapPin size={12} />
											{r}
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
export default function ShopPage() {
	return (
		<Suspense fallback={
			<Container className="py-12">
				<div className="text-center text-maroon/60">Loading shop...</div>
			</Container>
		}>
			<ShopPageContent />
		</Suspense>
	);
}
