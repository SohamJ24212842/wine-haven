"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Gift, Star, Sparkles, UtensilsCrossed } from "lucide-react";

type OccasionTile = {
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	href: string;
	color: string;
	bgGradient: string;
};

const occasions: OccasionTile[] = [
	{
		title: "Christmas Gifts",
		subtitle: "Perfect presents",
		icon: <Gift className="w-8 h-8" />,
		href: "/shop?category=Wine&christmasGift=true",
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
	},
	{
		title: "Staff Picks",
		subtitle: "Our favorites",
		icon: <Star className="w-8 h-8" />,
		href: "/shop?category=Wine&featured=true",
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
	},
];

export function ShopByOccasion() {
	return (
		<section className="py-8 sm:py-12 md:py-16 bg-cream">
			<Container>
				<div className="text-center mb-8 sm:mb-10 md:mb-12">
					<h2 className="font-[var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold text-maroon mb-2">
						Shop by Occasion
					</h2>
					<p className="text-maroon/70 text-sm sm:text-base md:text-lg">Find the perfect bottle for every moment</p>
				</div>

			<div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
					{occasions.map((occasion) => (
						<Link
							key={occasion.title}
							href={occasion.href}
							className="group block relative"
						>
							<div
								className={`relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br ${occasion.bgGradient} border border-maroon/10 p-4 sm:p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200`}
							>
								<div className={`${occasion.color} mb-2 sm:mb-3 flex justify-center`}>
									{occasion.icon}
								</div>
								<h3 className="font-semibold text-maroon text-xs sm:text-sm md:text-base mb-1 group-hover:text-gold transition-colors">
									{occasion.title}
								</h3>
								<p className="text-[10px] sm:text-xs text-maroon/60">{occasion.subtitle}</p>
							</div>
						</Link>
					))}
				</div>
			</Container>
		</section>
	);
}


