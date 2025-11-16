"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Gift, Star, Sparkles, UtensilsCrossed, ChevronDown } from "lucide-react";

type OccasionTile = {
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	href: string;
	color: string;
	bgGradient: string;
	menu?: { label: string; href: string }[];
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
		href: "/shop?category=Wine",
		color: "text-maroon",
		bgGradient: "from-maroon/10 to-maroon/5",
		menu: [
			{ label: "Beef & lamb", href: "/shop?q=beef" },
			{ label: "Pasta & pizza", href: "/shop?q=pasta" },
			{ label: "Seafood & shellfish", href: "/shop?q=seafood" },
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
		menu: [
			{ label: "Champagne", href: "/shop?q=champagne" },
			{ label: "Prosecco", href: "/shop?category=Wine&wineType=Prosecco" },
			{ label: "Sparkling Rosé", href: "/shop?q=sparkling%20ros%C3%A9" },
		],
	},
];

export function ShopByOccasion() {
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

			<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
					{occasions.map((occasion, index) => (
						<motion.div
							key={occasion.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Link
								href={occasion.href}
								className="group block relative"
							>
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

									{/* Optional small hover menu trigger (bottom-facing arrow) */}
									{occasion.menu && (
										<div className="absolute bottom-3 right-3">
											<div className="relative group/menu">
												<button
													type="button"
													onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
													className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] text-maroon shadow-sm border border-maroon/10 hover:bg-white"
												>
													<span>More</span>
													<ChevronDown className="w-3 h-3" />
												</button>
												<div className="pointer-events-none opacity-0 group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto absolute right-0 bottom-full mb-2 w-40 rounded-lg bg-white shadow-lg border border-maroon/10 text-left py-2 z-10">
													{occasion.menu.map((item) => (
														<Link
															key={item.label}
															href={item.href}
															className="block px-3 py-1.5 text-xs text-maroon/80 hover:bg-soft-gray"
															onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
														>
															{item.label}
														</Link>
													))}
												</div>
											</div>
										</div>
									)}
								</motion.div>
							</Link>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}


