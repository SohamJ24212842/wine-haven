"use client";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type HorizontalScrollSectionProps = {
	title: string;
	subtitle?: string;
	products: Product[];
	filterUrl?: string; // URL params for filtering shop page
};

export function HorizontalScrollSection({ title, subtitle, products, filterUrl }: HorizontalScrollSectionProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Build shop URL based on section type
	const getShopUrl = () => {
		if (filterUrl) return `/shop?${filterUrl}`;
		
		// Default filters based on section title
		if (title.includes("Wine")) return "/shop?category=Wine";
		if (title.includes("Spirit")) return "/shop?category=Spirit";
		if (title.includes("Christmas")) return "/shop?christmasGift=true";
		if (title.includes("New")) return "/shop?new=true";
		
		return "/shop";
	};

	// Check scroll position - throttled for performance
	const checkScroll = () => {
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}
		scrollTimeoutRef.current = setTimeout(() => {
			if (!scrollRef.current) return;
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}, 100); // Throttle to every 100ms
	};

	// Scroll functions
	const scroll = (direction: "left" | "right") => {
		if (!scrollRef.current) return;
		const scrollAmount = 320; // Width of card + gap
		const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
		scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "auto" });
	};

	// Removed auto-scroll for better performance

	useEffect(() => {
		checkScroll();
		const scrollElement = scrollRef.current;
		if (scrollElement) {
			scrollElement.addEventListener("scroll", checkScroll, { passive: true });
		}
		return () => {
			if (scrollElement) {
				scrollElement.removeEventListener("scroll", checkScroll);
			}
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, []);

	return (
		<section className="py-8 sm:py-12 md:py-16 bg-cream relative">
			<Container>
				<div className="flex items-end justify-between mb-4">
					<SectionHeading subtitle={subtitle}>{title}</SectionHeading>
					<Link
						href={getShopUrl()}
						className="flex items-center gap-2 text-sm font-medium text-maroon hover:text-gold transition-colors"
					>
						View All
						<ArrowRight size={16} />
					</Link>
				</div>
				<div className="mt-6 sm:mt-8 md:mt-10 relative">
					{/* Scroll buttons */}
					{canScrollLeft && (
						<button
							onClick={() => scroll("left")}
							className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-maroon/20 rounded-full p-2 shadow-lg transition-colors"
							aria-label="Scroll left"
						>
							<ChevronLeft className="w-5 h-5 text-maroon" />
						</button>
					)}
					{canScrollRight && (
						<button
							onClick={() => scroll("right")}
							className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-maroon/20 rounded-full p-2 shadow-lg transition-colors"
							aria-label="Scroll right"
						>
							<ChevronRight className="w-5 h-5 text-maroon" />
						</button>
					)}
					
					<div 
						ref={scrollRef}
						className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
					>
						{products.map((product) => (
							<div
								key={product.slug}
								className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px]"
							>
								<ProductCard product={product} />
							</div>
						))}
					</div>
					
					{/* Scroll hint */}
					{products.length > 3 && (
						<div className="text-center mt-4 text-xs text-maroon/60">
							Scroll to see more →
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}

