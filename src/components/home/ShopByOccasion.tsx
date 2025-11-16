"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Gift, Heart, Star, Sparkles, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type QuickLink = {
	label: string;
	href: string;
};

type OccasionTile = {
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	href: string;
	color: string;
	bgGradient: string;
	quickLinks?: QuickLink[];
};

const occasions: OccasionTile[] = [
	{
		title: "Christmas Gifts",
		subtitle: "Perfect presents",
		icon: <Gift className="w-8 h-8" />,
		href: "/shop?christmasGift=true",
		color: "text-red-600",
		bgGradient: "from-red-50 to-red-100/50",
	},
	{
		title: "Dinner Pairing",
		subtitle: "Wines for meals",
		icon: <UtensilsCrossed className="w-8 h-8" />,
		// Primary action: Steak Night (red wines)
		href: "/shop?wineType=Red&search=beef,steak",
		color: "text-maroon",
		bgGradient: "from-maroon/10 to-maroon/5",
		quickLinks: [
			{ label: "Steak / Beef", href: "/shop?wineType=Red&search=beef,steak" },
			{ label: "Seafood", href: "/shop?wineType=White&search=seafood,fish" },
			{ label: "Pasta Night", href: "/shop?search=pasta,tomato" },
			{ label: "Spicy / Curry", href: "/shop?search=curry,spice" },
		],
	},
	{
		title: "Staff Picks",
		subtitle: "Our favorites",
		icon: <Star className="w-8 h-8" />,
		href: "/shop?category=Wine",
		color: "text-gold",
		bgGradient: "from-gold/20 to-gold/10",
	},
	{
		title: "Celebration",
		subtitle: "Champagne & sparkling",
		icon: <Sparkles className="w-8 h-8" />,
		href: "/shop?category=Wine&wineType=Sparkling",
		color: "text-blue-600",
		bgGradient: "from-blue-50 to-blue-100/50",
		quickLinks: [
			{ label: "All Sparkling", href: "/shop?category=Wine&wineType=Sparkling" },
			{ label: "Champagne", href: "/shop?category=Wine&wineType=Sparkling&country=France" },
			{ label: "Prosecco", href: "/shop?wineType=Prosecco" },
		],
	},
];

export function ShopByOccasion() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) {
				setOpenIndex(null);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<section className="py-16 bg-cream">
			<Container>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-maroon mb-2">
						Shop by Occasion
					</h2>
					<p className="text-maroon/70 text-lg">Find the perfect bottle for every moment</p>
				</motion.div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto justify-items-stretch">
					{occasions.map((occasion, index) => (
						<motion.div
							key={occasion.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="group relative" ref={openIndex === index ? menuRef : undefined}>
								<Link href={occasion.href} className="block">
									<motion.div
										whileHover={{ y: -4, scale: 1.02 }}
										transition={{ duration: 0.2 }}
										className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${occasion.bgGradient} border border-maroon/10 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300`}
									>
										<motion.div
											className={`${occasion.color} mb-3 flex justify-center`}
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ duration: 0.2 }}
										>
											{occasion.icon}
										</motion.div>
										<h3 className="font-semibold text-maroon text-sm md:text-base mb-1 group-hover:text-gold transition-colors">
											{occasion.title}
										</h3>
										<p className="text-xs text-maroon/60">{occasion.subtitle}</p>

										{/* Hover effect overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-300" />

										{/* Split button chevron for quick links */}
										{occasion.quickLinks && (
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													setOpenIndex((prev) => (prev === index ? null : index));
												}}
												aria-label="More options"
												className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 border border-maroon/10 text-maroon/70 hover:text-maroon shadow-sm flex items-center justify-center"
											>
												<span className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`}>▾</span>
											</button>
										)}
									</motion.div>
								</Link>

								{/* Quick links popover */}
								{occasion.quickLinks && openIndex === index && (
									<div className="absolute z-20 right-0 mt-2 w-56 rounded-md border border-maroon/10 bg-white shadow-xl p-2">
										{occasion.quickLinks.map((ql) => (
											<Link
												key={ql.label}
												href={ql.href}
												onClick={() => setOpenIndex(null)}
												className="block px-3 py-2 rounded text-sm text-maroon/80 hover:bg-soft-gray hover:text-maroon"
											>
												{ql.label}
											</Link>
										))}
									</div>
								)}
							</div>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}


