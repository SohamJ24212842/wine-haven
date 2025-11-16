"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Menu, ChevronDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartTray } from "@/components/cart/CartTray";
import { SearchBar } from "@/components/layout/SearchBar";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MenuData = {
	countries: string[];
	regions: string[];
	wineTypes: string[];
	spiritTypes: string[];
	beerStyles: string[];
	counts: {
		wine: number;
		spirit: number;
		beer: number;
		gifts: number;
		onSale: number;
		sparkling: number;
	};
};

export function DynamicNavbar() {
	const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
	const [menuData, setMenuData] = useState<MenuData | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch menu data on mount
	useEffect(() => {
		fetch('/api/menu-data')
			.then(res => res.json())
			.then(data => setMenuData(data))
			.catch(err => console.error('Failed to fetch menu data:', err));
	}, []);

	const handleMouseEnter = (menu: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setHoveredMenu(menu);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setHoveredMenu(null);
		}, 400);
	};

	const buildShopUrl = (params: Record<string, string | boolean | undefined>) => {
		const urlParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				urlParams.set(key, String(value));
			}
		});
		return `/shop?${urlParams.toString()}`;
	};

	if (!menuData) {
		// Loading state - show basic navbar
		return (
			<header className="sticky top-0 z-40 border-b border-maroon/20 backdrop-blur-md bg-cream/95 shadow-sm">
				<Container className="flex h-16 items-center justify-between">
					<Link href="/" className={cn("text-xl font-semibold", "text-maroon", "tracking-wide")}>
						Wine Haven
					</Link>
					<nav className="hidden lg:flex items-center gap-1">
						<CartTray />
					</nav>
				</Container>
			</header>
		);
	}

	return (
		<header className="sticky top-0 z-40 border-b border-maroon/20 backdrop-blur-md bg-cream/95 shadow-sm">
			<Container className="flex h-16 items-center justify-between">
				<Link href="/" className={cn("text-xl font-semibold", "text-maroon", "tracking-wide")}>
					Wine Haven
				</Link>
				<nav className="hidden lg:flex items-center gap-4">
					{/* Gifts */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("gifts")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href={buildShopUrl({ christmasGift: true })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "gifts" && "text-gold"
							)}
						>
							Gifts
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "gifts" && "rotate-180")} />
						</Link>
						{/* Hover buffer to prevent accidental close when moving to dropdown */}
						{hoveredMenu === "gifts" && (
							<div
								className="absolute top-full left-0 h-2 w-[600px]"
								onMouseEnter={() => handleMouseEnter("gifts")}
								onMouseLeave={handleMouseLeave}
							/>
						)}
						<AnimatePresence>
							{hoveredMenu === "gifts" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-[600px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("gifts")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-2 gap-6">
										{/* Main gift sets */}
										<div>
											<h3 className="font-semibold text-maroon mb-3">Gift Sets</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Gin", christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Gin & Glass Set
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Beer", christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Beer Gift Sets
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Beer", beerStyle: "Pale Ale", christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Pale Ale Gift Sets
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Wine", wineType: "Sparkling", christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Prosecco & Glass Gift Set
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey", christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Whiskey & Cask Gifts
													</Link>
												</li>
											</ul>
										</div>

										{/* Other gifts */}
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other Gifts</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link
														href="/visit-us#personal-orders"
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Personal Large Orders
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ christmasGift: true })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														All Christmas Gifts
													</Link>
												</li>
												<li>
													<Link
														href="/visit-us#vouchers"
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Store Voucher (in-store only)
													</Link>
												</li>
											</ul>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Wine */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("wine")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href={buildShopUrl({ category: "Wine" })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "wine" && "text-gold"
							)}
						>
							Wine
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "wine" && "rotate-180")} />
						</Link>
						{hoveredMenu === "wine" && (
							<div
								className="absolute top-full left-0 h-2 w-[720px]"
								onMouseEnter={() => handleMouseEnter("wine")}
								onMouseLeave={handleMouseLeave}
							/>
						)}
						<AnimatePresence>
							{hoveredMenu === "wine" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[720px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("wine")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-2 gap-6">
										{/* Left: Country */}
										<div>
											<h3 className="font-semibold text-maroon mb-3">Country</h3>
											<ul className="space-y-2 text-sm">
												{[
													{ label: "Argentina", value: "Argentina" },
													{ label: "Austria", value: "Austria" },
													{ label: "Chile", value: "Chile" },
													{ label: "France", value: "France" },
													{ label: "Germany", value: "Germany" },
													{ label: "Ireland", value: "Ireland" },
													{ label: "Italy", value: "Italy" },
													{ label: "New Zealand", value: "New Zealand" },
													{ label: "Portugal", value: "Portugal" },
													{ label: "South Africa", value: "South Africa" },
													{ label: "Spain", value: "Spain" },
													// Display California nicely but filter by USA, which matches product data
													{ label: "California (USA)", value: "USA" },
												].map(({ label, value }) => (
													<li key={label}>
														<Link
															href={buildShopUrl({ category: "Wine", country: value })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															{label}
														</Link>
													</li>
												))}
											</ul>
										</div>

										{/* Right: Type of Wine + Grape Type (scrollable) */}
										<div className="grid grid-cols-1 gap-6">
											<div>
												<h3 className="font-semibold text-maroon mb-3">Type of Wine</h3>
												<ul className="space-y-2 text-sm">
													<li>
														<Link
															href={buildShopUrl({ category: "Wine", wineType: "Red" })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															Red Wines
														</Link>
													</li>
													<li>
														<Link
															href={buildShopUrl({ category: "Wine", wineType: "White" })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															White Wines
														</Link>
													</li>
													<li>
														<Link
															href={buildShopUrl({ category: "Wine", wineType: "Rosé" })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															Rosé Wines
														</Link>
													</li>
													<li>
														<Link
															href={buildShopUrl({ category: "Wine", wineType: "Sparkling" })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															Sparkling Wines
														</Link>
													</li>
													<li>
														<Link
															href={buildShopUrl({ category: "Wine", wineType: "Prosecco" })}
															className="text-maroon/70 hover:text-gold transition-colors"
														>
															Prosecco
														</Link>
													</li>
												</ul>
											</div>

											<div>
												<h3 className="font-semibold text-maroon mb-3">Grape Type</h3>
												<ul className="space-y-2 text-sm h-40 overflow-y-auto pr-1">
													{[
														"Cabernet Sauvignon",
														"Chardonnay",
														"Malbec",
														"Merlot",
														"Pinot Noir",
														"Riesling",
														"Sauvignon Blanc",
														"Syrah/Shiraz",
														"Vinho Verde",
														"Nebbiolo",
														"Tempranillo",
														"Sangiovese",
														"Barbera",
													].map((grape) => (
														<li key={grape}>
															<Link
																href={buildShopUrl({ category: "Wine", search: grape })}
																className="text-maroon/70 hover:text-gold transition-colors"
															>
																{grape}
															</Link>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Spirits */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("spirits")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href={buildShopUrl({ category: 'Spirit' })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "spirits" && "text-gold"
							)}
						>
							Spirits
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "spirits" && "rotate-180")} />
						</Link>
						{hoveredMenu === "spirits" && (
							<div
								className="absolute top-full left-0 h-2 w-[720px]"
								onMouseEnter={() => handleMouseEnter("spirits")}
								onMouseLeave={handleMouseLeave}
							/>
						)}
						<AnimatePresence>
							{hoveredMenu === "spirits" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[720px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("spirits")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-3 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Whiskey</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey", country: "Ireland" })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Irish Whiskey
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey", country: "Scotland" })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Scotch Whisky
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey", country: "USA" })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Bourbon & American
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey", country: "Japan" })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														Japanese & World Whiskey
													</Link>
												</li>
												<li>
													<Link
														href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey" })}
														className="text-maroon/70 hover:text-gold transition-colors"
													>
														All Whiskey
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Brandy</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', country: 'France', search: 'Cognac' })} className="text-maroon/70 hover:text-gold transition-colors">
														Cognac
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', search: 'Brandy' })} className="text-maroon/70 hover:text-gold transition-colors">
														Brandy
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other Spirits</h3>
											<ul className="space-y-2 text-sm">
												{menuData.spiritTypes
													.filter(type => type !== 'Whiskey')
													.map(type => (
														<li key={type}>
															<Link href={buildShopUrl({ category: 'Spirit', spiritType: type })} className="text-maroon/70 hover:text-gold transition-colors">
																{type}
															</Link>
														</li>
													))}
											</ul>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Champagne & Sparkling */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("champagne")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "champagne" && "text-gold"
							)}
						>
							<span className="flex flex-col leading-tight">
								<span>Champagne &</span>
								<span>Sparkling</span>
							</span>
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "champagne" && "rotate-180")} />
						</Link>
						{hoveredMenu === "champagne" && (
							<div
								className="absolute top-full right-0 h-2 w-[640px]"
								onMouseEnter={() => handleMouseEnter("champagne")}
								onMouseLeave={handleMouseLeave}
							/>
						)}
						<AnimatePresence>
							{hoveredMenu === "champagne" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full right-0 mt-1 w-[640px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("champagne")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-3 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Champagne</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', country: 'France' })} className="text-maroon/70 hover:text-gold transition-colors">
														All Champagne
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Bollinger
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Krug
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Moët & Chandon
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Veuve Clicquot
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Sparkling</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														All Sparkling Wines ({menuData.counts.sparkling})
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Cremant
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Franciacorta
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Prosecco</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', country: 'Italy' })} className="text-maroon/70 hover:text-gold transition-colors">
														All Prosecco
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling' })} className="text-maroon/70 hover:text-gold transition-colors">
														Premium Prosecco
													</Link>
												</li>
											</ul>
										</div>
										{/* Cava section removed per request */}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Simple Links */}
					<Link className="px-3 py-2 hover:text-gold transition-colors text-sm" href="/about">
						About Us
					</Link>
					<Link className="px-3 py-2 hover:text-gold transition-colors text-sm" href="/visit-us">
						Visit Us
					</Link>
					
					{/* Search Bar */}
					<SearchBar />
					
					{/* Click & Collect Button */}
					<Link
						href="/checkout"
						className="relative inline-flex items-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm text-white hover:bg-maroon/90 transition-colors font-medium"
					>
						<ShoppingBag size={18} />
						<span className="flex flex-col leading-tight">
							<span>Click &</span>
							<span>Collect</span>
						</span>
					</Link>
				</nav>
				<div className="lg:hidden flex items-center gap-2">
					<SearchBar />
					<CartTray />
					<button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-maroon/20 text-maroon hover:bg-soft-gray" aria-label="Open menu">
						<Menu size={18} />
					</button>
				</div>
			</Container>
		</header>
	);
}
