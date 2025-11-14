"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Menu, ChevronDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartTray } from "@/components/cart/CartTray";
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
		}, 150);
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
									<div className="grid grid-cols-5 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Gift Of Choice</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop" className="text-maroon/70 hover:text-gold transition-colors">
														Store Voucher
													</Link>
												</li>
												<li>
													<Link href="/shop" className="text-maroon/70 hover:text-gold transition-colors">
														Digital Gift Card
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Wine Gifts</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														2 Bottle
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														3 Bottle
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														6 Bottle
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														12 Bottle
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Spirit Gifts</h3>
											<ul className="space-y-2 text-sm">
												{menuData.spiritTypes.filter(t => t === 'Whiskey' || t === 'Gin').map(type => (
													<li key={type}>
														<Link href={buildShopUrl({ category: 'Spirit', spiritType: type, christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
															{type} Gifts
														</Link>
													</li>
												))}
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														Other Spirit Gifts
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Champagne Gifts</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														Glass Gift Set
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														Gift Box
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
														Large Formats
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Miscellaneous</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop" className="text-maroon/70 hover:text-gold transition-colors">
														Wine Glassware
													</Link>
												</li>
												<li>
													<Link href="/shop" className="text-maroon/70 hover:text-gold transition-colors">
														Wine Gadgets
													</Link>
												</li>
												<li>
													<Link href="/shop" className="text-maroon/70 hover:text-gold transition-colors">
														Spirit Sets & Accessories
													</Link>
												</li>
											</ul>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Offers */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("offers")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href={buildShopUrl({ onSale: true })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "offers" && "text-gold"
							)}
						>
							Offers
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "offers" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "offers" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-64 rounded-md border border-maroon/10 bg-white shadow-xl p-4 z-50"
									onMouseEnter={() => handleMouseEnter("offers")}
									onMouseLeave={handleMouseLeave}
								>
									<ul className="space-y-2 text-sm">
										<li>
											<Link href={buildShopUrl({ onSale: true, category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
												Weekly Wine Offers ({menuData.counts.onSale})
											</Link>
										</li>
										<li>
											<Link href={buildShopUrl({ onSale: true })} className="text-maroon/70 hover:text-gold transition-colors">
												Pre Selected Cases
											</Link>
										</li>
										<li>
											<Link href={buildShopUrl({ onSale: true, category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
												Wine Offers
											</Link>
										</li>
										<li>
											<Link href={buildShopUrl({ onSale: true, category: 'Spirit' })} className="text-maroon/70 hover:text-gold transition-colors">
												Spirit Offers
											</Link>
										</li>
										<li>
											<Link href={buildShopUrl({ christmasGift: true })} className="text-maroon/70 hover:text-gold transition-colors">
												Christmas Gifts ({menuData.counts.gifts})
											</Link>
										</li>
									</ul>
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
							href={buildShopUrl({ category: 'Wine' })}
							className={cn(
								"flex items-center gap-1 px-3 py-2 hover:text-gold transition-colors text-sm",
								hoveredMenu === "wine" && "text-gold"
							)}
						>
							Wine
							<ChevronDown size={12} className={cn("transition-transform", hoveredMenu === "wine" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "wine" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-[900px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("wine")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-6 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Type</h3>
											<ul className="space-y-2 text-sm">
												{menuData.wineTypes.map(type => (
													<li key={type}>
														<Link href={buildShopUrl({ category: 'Wine', wineType: type })} className="text-maroon/70 hover:text-gold transition-colors">
															{type === 'Sparkling' ? 'Sparkling' : `${type} Wine`}
														</Link>
													</li>
												))}
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Country</h3>
											<ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
												{menuData.countries.slice(0, 10).map(country => (
													<li key={country}>
														<Link href={buildShopUrl({ category: 'Wine', country })} className="text-maroon/70 hover:text-gold transition-colors">
															{country}
														</Link>
													</li>
												))}
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Grape</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Cabernet Sauvignon
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Merlot
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Chardonnay
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Sauvignon Blanc
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Pinot Noir
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other Formats</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Magnum - 1.5l
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Half Bottle - 37.5cl
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Larger Formats
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Price</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', minPrice: '0', maxPrice: '25' })} className="text-maroon/70 hover:text-gold transition-colors">
														&lt; €25
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', minPrice: '25', maxPrice: '75' })} className="text-maroon/70 hover:text-gold transition-colors">
														€25 - €75
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', minPrice: '75', maxPrice: '150' })} className="text-maroon/70 hover:text-gold transition-colors">
														€75 - €150
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine', minPrice: '150' })} className="text-maroon/70 hover:text-gold transition-colors">
														Over €150
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Drinking Style</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Dry Refreshing White
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Aromatic Fruity White
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Light Fruity Red
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Wine' })} className="text-maroon/70 hover:text-gold transition-colors">
														Bold Armchair Red
													</Link>
												</li>
											</ul>
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
						<AnimatePresence>
							{hoveredMenu === "spirits" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-[900px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("spirits")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-5 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Whiskey</h3>
											<ul className="space-y-2 text-sm">
												{menuData.spiritTypes.filter(t => t === 'Whiskey').length > 0 && (
													<>
														<li>
															<Link href={buildShopUrl({ category: 'Spirit', spiritType: 'Whiskey', country: 'Ireland' })} className="text-maroon/70 hover:text-gold transition-colors">
																Irish Whiskey
															</Link>
														</li>
														<li>
															<Link href={buildShopUrl({ category: 'Spirit', spiritType: 'Whiskey' })} className="text-maroon/70 hover:text-gold transition-colors">
																All Whiskey
															</Link>
														</li>
													</>
												)}
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Brandy</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', country: 'France' })} className="text-maroon/70 hover:text-gold transition-colors">
														Cognac
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Spirit' })} className="text-maroon/70 hover:text-gold transition-colors">
														Brandy
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other</h3>
											<ul className="space-y-2 text-sm">
												{menuData.spiritTypes.map(type => (
													<li key={type}>
														<Link href={buildShopUrl({ category: 'Spirit', spiritType: type })} className="text-maroon/70 hover:text-gold transition-colors">
															{type}
														</Link>
													</li>
												))}
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Whiskey Brands</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', spiritType: 'Whiskey' })} className="text-maroon/70 hover:text-gold transition-colors">
														Irish Whiskey
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Spirit', spiritType: 'Whiskey' })} className="text-maroon/70 hover:text-gold transition-colors">
														All Whiskey
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">RTDs</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Beer' })} className="text-maroon/70 hover:text-gold transition-colors">
														Miniatures
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Beer' })} className="text-maroon/70 hover:text-gold transition-colors">
														Cocktails
													</Link>
												</li>
												<li>
													<Link href={buildShopUrl({ category: 'Beer' })} className="text-maroon/70 hover:text-gold transition-colors">
														Spritz
													</Link>
												</li>
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
						<AnimatePresence>
							{hoveredMenu === "champagne" && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-2 w-[800px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("champagne")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-4 gap-6">
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
														Dom Pérignon
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
										<div>
											<h3 className="font-semibold text-maroon mb-3">Cava</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href={buildShopUrl({ category: 'Wine', wineType: 'Sparkling', country: 'Spain' })} className="text-maroon/70 hover:text-gold transition-colors">
														All Cava
													</Link>
												</li>
											</ul>
										</div>
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
					<Link className="px-3 py-2 hover:text-gold transition-colors text-sm" href="/contact">Contact</Link>
					
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
					<CartTray />
					<button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-maroon/20 text-maroon hover:bg-soft-gray" aria-label="Open menu">
						<Menu size={18} />
					</button>
				</div>
			</Container>
		</header>
	);
}
