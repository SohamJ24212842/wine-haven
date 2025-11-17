"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Menu, ChevronDown, ShoppingBag, X } from "lucide-react";
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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
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
		}, 700);
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
			<Container className="flex h-16 items-center justify-between gap-4">
				<Link href="/" className={cn("text-xl font-semibold", "text-maroon", "tracking-wide", "flex-shrink-0")}>
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
								className="absolute top-full left-0 h-4 w-[600px]"
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
								className="absolute top-full left-0 h-4 w-[720px]"
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
								className="absolute top-full left-0 h-4 w-[720px]"
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
								className="absolute top-full right-0 h-4 w-[640px]"
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
				<div className="flex lg:hidden items-center gap-2 flex-shrink-0">
					<SearchBar />
					<CartTray />
					<button 
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setMobileMenuOpen(true);
						}}
						onTouchStart={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setMobileMenuOpen(true);
						}}
						className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-maroon/10 border-2 border-maroon text-maroon hover:bg-maroon/20 active:scale-95 transition-all shadow-sm z-50" 
						aria-label="Open menu"
						type="button"
					>
						<Menu size={22} strokeWidth={3} />
					</button>
				</div>
			</Container>

			{/* Mobile Menu Drawer */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setMobileMenuOpen(false);
							}}
							onTouchStart={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setMobileMenuOpen(false);
							}}
							className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
						/>
						{/* Drawer */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream z-[101] lg:hidden overflow-y-auto shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-4 border-b border-maroon/20 flex items-center justify-between">
								<Link 
									href="/" 
									onClick={() => setMobileMenuOpen(false)}
									className="text-lg font-semibold text-maroon"
								>
									Wine Haven
								</Link>
								<button 
									onClick={() => setMobileMenuOpen(false)}
									className="text-maroon hover:text-gold"
									aria-label="Close menu"
								>
									<X size={24} />
								</button>
							</div>

							<nav className="p-4 space-y-2">
								{/* Gifts */}
								<div className="border-b border-maroon/10 pb-2">
									<button
										onClick={() => setMobileAccordion(mobileAccordion === "gifts" ? null : "gifts")}
										className="flex items-center justify-between w-full py-2 text-maroon font-medium"
									>
										Gifts
										<ChevronDown size={16} className={cn("transition-transform", mobileAccordion === "gifts" && "rotate-180")} />
									</button>
									{mobileAccordion === "gifts" && (
										<div className="pl-4 pt-2 space-y-2 text-sm">
											<Link href={buildShopUrl({ christmasGift: true })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												All Christmas Gifts
											</Link>
											<Link href={buildShopUrl({ category: "Wine", christmasGift: true })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Wine Gifts
											</Link>
											<Link href={buildShopUrl({ category: "Spirit", christmasGift: true })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Spirit Gifts
											</Link>
										</div>
									)}
								</div>

								{/* Wine */}
								<div className="border-b border-maroon/10 pb-2">
									<button
										onClick={() => setMobileAccordion(mobileAccordion === "wine" ? null : "wine")}
										className="flex items-center justify-between w-full py-2 text-maroon font-medium"
									>
										Wine
										<ChevronDown size={16} className={cn("transition-transform", mobileAccordion === "wine" && "rotate-180")} />
									</button>
									{mobileAccordion === "wine" && (
										<div className="pl-4 pt-2 space-y-2 text-sm">
											<Link href={buildShopUrl({ category: "Wine" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												All Wines
											</Link>
											<Link href={buildShopUrl({ category: "Wine", wineType: "Red" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Red Wine
											</Link>
											<Link href={buildShopUrl({ category: "Wine", wineType: "White" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												White Wine
											</Link>
											<Link href={buildShopUrl({ category: "Wine", wineType: "Rosé" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Rosé Wine
											</Link>
											<Link href={buildShopUrl({ category: "Wine", wineType: "Sparkling" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Sparkling Wine
											</Link>
										</div>
									)}
								</div>

								{/* Spirits */}
								<div className="border-b border-maroon/10 pb-2">
									<button
										onClick={() => setMobileAccordion(mobileAccordion === "spirits" ? null : "spirits")}
										className="flex items-center justify-between w-full py-2 text-maroon font-medium"
									>
										Spirits
										<ChevronDown size={16} className={cn("transition-transform", mobileAccordion === "spirits" && "rotate-180")} />
									</button>
									{mobileAccordion === "spirits" && (
										<div className="pl-4 pt-2 space-y-2 text-sm">
											<Link href={buildShopUrl({ category: "Spirit" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												All Spirits
											</Link>
											<Link href={buildShopUrl({ category: "Spirit", spiritType: "Whiskey" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Whiskey
											</Link>
											<Link href={buildShopUrl({ category: "Spirit", spiritType: "Gin" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Gin
											</Link>
											<Link href={buildShopUrl({ category: "Spirit", spiritType: "Vodka" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Vodka
											</Link>
											<Link href={buildShopUrl({ category: "Spirit", spiritType: "Rum" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Rum
											</Link>
										</div>
									)}
								</div>

								{/* Beer */}
								<div className="border-b border-maroon/10 pb-2">
									<button
										onClick={() => setMobileAccordion(mobileAccordion === "beer" ? null : "beer")}
										className="flex items-center justify-between w-full py-2 text-maroon font-medium"
									>
										Beer
										<ChevronDown size={16} className={cn("transition-transform", mobileAccordion === "beer" && "rotate-180")} />
									</button>
									{mobileAccordion === "beer" && (
										<div className="pl-4 pt-2 space-y-2 text-sm">
											<Link href={buildShopUrl({ category: "Beer" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												All Beers
											</Link>
											<Link href={buildShopUrl({ category: "Beer", beerStyle: "Lager" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Lager
											</Link>
											<Link href={buildShopUrl({ category: "Beer", beerStyle: "IPA" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												IPA
											</Link>
											<Link href={buildShopUrl({ category: "Beer", beerStyle: "Stout" })} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-maroon/70">
												Stout
											</Link>
										</div>
									)}
								</div>

								{/* Champagne & Sparkling */}
								<Link 
									href={buildShopUrl({ category: "Wine", wineType: "Sparkling" })} 
									onClick={() => setMobileMenuOpen(false)}
									className="block py-2 text-maroon font-medium border-b border-maroon/10"
								>
									Champagne & Sparkling
								</Link>

								{/* About Us */}
								<Link 
									href="/about" 
									onClick={() => setMobileMenuOpen(false)}
									className="block py-2 text-maroon font-medium border-b border-maroon/10"
								>
									About Us
								</Link>

								{/* Visit Us */}
								<Link 
									href="/visit-us" 
									onClick={() => setMobileMenuOpen(false)}
									className="block py-2 text-maroon font-medium border-b border-maroon/10"
								>
									Visit Us
								</Link>

								{/* Click & Collect */}
								<Link 
									href="/checkout" 
									onClick={() => setMobileMenuOpen(false)}
									className="block py-2 text-gold font-medium"
								>
									Click & Collect
								</Link>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</header>
	);
}
