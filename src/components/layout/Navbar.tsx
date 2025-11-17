"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartTray } from "@/components/cart/CartTray";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
	const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

	return (
		<header className="sticky top-0 z-40 border-b border-maroon/20 backdrop-blur-md bg-cream/95 shadow-sm">
			<Container className="flex h-16 items-center justify-between">
				<Link href="/" className={cn("text-xl font-semibold", "text-maroon", "tracking-wide")}>
					Wine Haven
				</Link>
				<nav className="hidden lg:flex items-center gap-1">
					{/* Gifts */}
					<div
						className="relative"
						onMouseEnter={() => handleMouseEnter("gifts")}
						onMouseLeave={handleMouseLeave}
					>
						<Link
							href="/shop?christmasGift=true"
							className={cn(
								"flex items-center gap-1 px-4 py-2 hover:text-gold transition-colors",
								hoveredMenu === "gifts" && "text-gold"
							)}
						>
							Gifts
							<ChevronDown size={14} className={cn("transition-transform", hoveredMenu === "gifts" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "gifts" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[600px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
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
													<Link href="/shop?christmasGift=true" className="text-maroon/70 hover:text-gold transition-colors">
														2 Bottle
													</Link>
												</li>
												<li>
													<Link href="/shop?christmasGift=true" className="text-maroon/70 hover:text-gold transition-colors">
														3 Bottle
													</Link>
												</li>
												<li>
													<Link href="/shop?christmasGift=true" className="text-maroon/70 hover:text-gold transition-colors">
														6 Bottle
													</Link>
												</li>
												<li>
													<Link href="/shop?christmasGift=true" className="text-maroon/70 hover:text-gold transition-colors">
														12 Bottle
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Spirit Gifts</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Whiskey Gifts
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Gin" className="text-maroon/70 hover:text-gold transition-colors">
														Gin Gifts
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit" className="text-maroon/70 hover:text-gold transition-colors">
														Other Spirit Gifts
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Champagne Gifts</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Glass Gift Set
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Gift Box
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
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
							href="/shop?onSale=true"
							className={cn(
								"flex items-center gap-1 px-4 py-2 hover:text-gold transition-colors",
								hoveredMenu === "offers" && "text-gold"
							)}
						>
							Offers
							<ChevronDown size={14} className={cn("transition-transform", hoveredMenu === "offers" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "offers" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-64 rounded-md border border-maroon/10 bg-white shadow-xl p-4 z-50"
									onMouseEnter={() => handleMouseEnter("offers")}
									onMouseLeave={handleMouseLeave}
								>
									<ul className="space-y-2 text-sm">
										<li>
											<Link href="/shop?onSale=true" className="text-maroon/70 hover:text-gold transition-colors">
												Weekly Wine Offers
											</Link>
										</li>
										<li>
											<Link href="/shop?onSale=true" className="text-maroon/70 hover:text-gold transition-colors">
												Pre Selected Cases
											</Link>
										</li>
										<li>
											<Link href="/shop?onSale=true&category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
												Wine Offers
											</Link>
										</li>
										<li>
											<Link href="/shop?onSale=true&category=Spirit" className="text-maroon/70 hover:text-gold transition-colors">
												Spirit Offers
											</Link>
										</li>
										<li>
											<Link href="/shop?christmasGift=true" className="text-maroon/70 hover:text-gold transition-colors">
												Christmas Gifts
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
							href="/shop?category=Wine"
							className={cn(
								"flex items-center gap-1 px-4 py-2 hover:text-gold transition-colors",
								hoveredMenu === "wine" && "text-gold"
							)}
						>
							Wine
							<ChevronDown size={14} className={cn("transition-transform", hoveredMenu === "wine" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "wine" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[900px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("wine")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-6 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Type</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=White" className="text-maroon/70 hover:text-gold transition-colors">
														White Wine
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Red" className="text-maroon/70 hover:text-gold transition-colors">
														Red Wine
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Rosé" className="text-maroon/70 hover:text-gold transition-colors">
														Rosé Wine
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Sparkling
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Country</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&country=France" className="text-maroon/70 hover:text-gold transition-colors">
														France
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&country=Spain" className="text-maroon/70 hover:text-gold transition-colors">
														Spain
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&country=Italy" className="text-maroon/70 hover:text-gold transition-colors">
														Italy
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&country=Portugal" className="text-maroon/70 hover:text-gold transition-colors">
														Portugal
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&country=Germany" className="text-maroon/70 hover:text-gold transition-colors">
														Germany
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Grape</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Cabernet Sauvignon
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Merlot
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Chardonnay
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Sauvignon Blanc
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Pinot Noir
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other Formats</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Magnum - 1.5l
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Half Bottle - 37.5cl
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Larger Formats
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Price</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&minPrice=0&maxPrice=25" className="text-maroon/70 hover:text-gold transition-colors">
														&lt; €25
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&minPrice=25&maxPrice=75" className="text-maroon/70 hover:text-gold transition-colors">
														€25 - €75
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&minPrice=75&maxPrice=150" className="text-maroon/70 hover:text-gold transition-colors">
														€75 - €150
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&minPrice=150" className="text-maroon/70 hover:text-gold transition-colors">
														Over €150
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Drinking Style</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Dry Refreshing White
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Aromatic Fruity White
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
														Light Fruity Red
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine" className="text-maroon/70 hover:text-gold transition-colors">
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
							href="/shop?category=Spirit"
							className={cn(
								"flex items-center gap-1 px-4 py-2 hover:text-gold transition-colors",
								hoveredMenu === "spirits" && "text-gold"
							)}
						>
							Spirits
							<ChevronDown size={14} className={cn("transition-transform", hoveredMenu === "spirits" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "spirits" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[900px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("spirits")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-5 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Whiskey</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey&country=Ireland" className="text-maroon/70 hover:text-gold transition-colors">
														Irish Whiskey
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey&country=Scotland" className="text-maroon/70 hover:text-gold transition-colors">
														Scottish Whisky
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey&country=USA" className="text-maroon/70 hover:text-gold transition-colors">
														American Whisky
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey&country=Japan" className="text-maroon/70 hover:text-gold transition-colors">
														Japanese Whisky
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														All Whiskey
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Brandy</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Spirit&country=France" className="text-maroon/70 hover:text-gold transition-colors">
														Cognac
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit" className="text-maroon/70 hover:text-gold transition-colors">
														Brandy
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Other</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Spirit&spiritType=Gin" className="text-maroon/70 hover:text-gold transition-colors">
														Gin
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Vodka" className="text-maroon/70 hover:text-gold transition-colors">
														Vodka
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Tequila" className="text-maroon/70 hover:text-gold transition-colors">
														Tequila
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Rum" className="text-maroon/70 hover:text-gold transition-colors">
														Rum
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Liqueur" className="text-maroon/70 hover:text-gold transition-colors">
														Liqueur
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Whiskey Brands</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Irish Whiskey
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Redbreast
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Bushmills
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Teeling
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Spirit&spiritType=Whiskey" className="text-maroon/70 hover:text-gold transition-colors">
														Jameson
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">RTDs</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Beer" className="text-maroon/70 hover:text-gold transition-colors">
														Miniatures
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Beer" className="text-maroon/70 hover:text-gold transition-colors">
														Cocktails
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Beer" className="text-maroon/70 hover:text-gold transition-colors">
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
							href="/shop?category=Wine&wineType=Sparkling"
							className={cn(
								"flex items-center gap-1 px-4 py-2 hover:text-gold transition-colors",
								hoveredMenu === "champagne" && "text-gold"
							)}
						>
							Champagne & Sparkling
							<ChevronDown size={14} className={cn("transition-transform", hoveredMenu === "champagne" && "rotate-180")} />
						</Link>
						<AnimatePresence>
							{hoveredMenu === "champagne" && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full left-0 mt-1 w-[800px] rounded-md border border-maroon/10 bg-white shadow-xl p-6 z-50"
									onMouseEnter={() => handleMouseEnter("champagne")}
									onMouseLeave={handleMouseLeave}
								>
									<div className="grid grid-cols-4 gap-6">
										<div>
											<h3 className="font-semibold text-maroon mb-3">Champagne</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling&country=France" className="text-maroon/70 hover:text-gold transition-colors">
														All Champagne
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Bollinger
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Dom Pérignon
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Moët & Chandon
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Veuve Clicquot
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Taittinger
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Sparkling</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														All Sparkling Wines
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Cremant
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Franciacorta
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Prosecco
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Prosecco</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling&country=Italy" className="text-maroon/70 hover:text-gold transition-colors">
														All Prosecco
													</Link>
												</li>
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling" className="text-maroon/70 hover:text-gold transition-colors">
														Premium Prosecco
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold text-maroon mb-3">Cava</h3>
											<ul className="space-y-2 text-sm">
												<li>
													<Link href="/shop?category=Wine&wineType=Sparkling&country=Spain" className="text-maroon/70 hover:text-gold transition-colors">
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
					<Link className="px-4 py-2 hover:text-gold transition-colors" href="/about">About</Link>
					<Link className="px-4 py-2 hover:text-gold transition-colors" href="/visit-us">Visit Us</Link>
					<CartTray />
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
