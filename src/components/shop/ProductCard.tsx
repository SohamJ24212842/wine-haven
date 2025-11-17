"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";

type ProductCardProps = {
	product: Product;
};

function formatBadge(p: Product) {
	if (p.category === "Wine" && p.wineType) return `${p.wineType} • ${p.country}`;
	if (p.category === "Beer" && p.beerStyle) return `${p.beerStyle} • ${p.country}`;
	if (p.category === "Spirit" && p.spiritType) return `${p.spiritType} • ${p.country}`;
	return `${p.category} • ${p.country}`;
}

function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
	return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart();
	const [isHovered, setIsHovered] = useState(false);
	const [showQuickView, setShowQuickView] = useState(false);

	const discountPercentage = product.onSale && product.salePrice 
		? calculateDiscountPercentage(product.price, product.salePrice)
		: null;

	const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		addItem(product);
	};

	const handleQuickView = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowQuickView(true);
	};

	const handleCardTap = () => {
		// On touch devices, first tap shows buttons, second tap navigates
		if ('ontouchstart' in window) {
			if (!isHovered) {
				setIsHovered(true);
				// Auto-hide after 3 seconds of no interaction
				setTimeout(() => setIsHovered(false), 3000);
			}
		}
	};

	return (
		<motion.div
			className="group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onTouchStart={handleCardTap}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.4 }}
		>
			<Link href={`/product/${product.slug}`} className="block">
				<motion.div 
					className={`overflow-hidden rounded-lg border border-maroon/10 bg-white transition-all duration-300 ${
						isHovered ? "shadow-xl" : "shadow-sm"
					}`}
					whileHover={{ 
						y: -4
					}}
				>
					<div className="relative aspect-[4/5] overflow-hidden bg-soft-gray flex items-center justify-center">
						{/* Premium floating shadow effect */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
						
						{/* Badges - Top Left with better styling */}
						<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
							{product.onSale && discountPercentage && (
								<motion.span 
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ 
										type: "spring", 
										stiffness: 500, 
										damping: 15,
										duration: 0.5
									}}
									whileHover={{ scale: 1.1 }}
									className="rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg uppercase tracking-wide"
								>
									-{discountPercentage}%
								</motion.span>
							)}
							{product.new && (
								<motion.span 
									initial={{ scale: 0, rotate: -12 }}
									animate={{ scale: 1, rotate: -12 }}
									transition={{ 
										type: "spring", 
										stiffness: 500, 
										damping: 15,
										duration: 0.5
									}}
									whileHover={{ scale: 1.1, rotate: -10 }}
									className="rounded-md bg-gold px-3 py-1.5 text-[11px] font-bold text-maroon shadow-lg uppercase tracking-wide border-2 border-maroon/20"
								>
									NEW
								</motion.span>
							)}
						</div>
						
						{/* Enhanced image with zoom effect */}
						<motion.div
							animate={{ 
								scale: isHovered ? 1.05 : 1,
								transition: { duration: 0.4, ease: "easeOut" }
							}}
							className="h-full w-full relative"
						>
							<Image
								src={product.image}
								alt={product.name}
								fill
								className="object-contain p-4"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
							/>
							{/* Subtle overlay on hover */}
							<div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
								isHovered ? "opacity-100" : "opacity-0"
							}`} />
						</motion.div>
						
					{/* Enhanced Quick View and Add to Cart Buttons Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ 
							opacity: isHovered ? 1 : 0,
							transition: { duration: 0.2 }
						}}
						className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
							isHovered ? "pointer-events-auto" : "pointer-events-none"
						}`}
					>
							<motion.button
								onClick={handleQuickView}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-maroon shadow-xl hover:bg-white transition-all"
							>
								<Eye size={16} />
								Quick Look
							</motion.button>
							<motion.button
								onClick={handleAddToCart}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-maroon shadow-xl hover:brightness-110 transition-all"
							>
								<ShoppingCart size={16} />
								Add to Cart
							</motion.button>
						</motion.div>
					</div>
					<div className="p-4">
						<div className="flex items-start justify-between">
							<p className="text-[10px] uppercase tracking-wide text-maroon/60 font-medium">{product.category}</p>
						</div>
						<h3 className="mt-1.5 text-sm font-semibold text-maroon line-clamp-2">{product.name}</h3>
						<p className="mt-1 text-xs text-maroon/70 line-clamp-1">
							{formatBadge(product)}
						</p>
						<div className="mt-3 flex items-center gap-2">
							{product.onSale && product.salePrice ? (
								<>
									<span className="text-base font-bold text-red-600">€{product.salePrice.toFixed(2)}</span>
									<span className="text-xs text-maroon/50 line-through">€{product.price.toFixed(2)}</span>
								</>
							) : (
								<span className="text-base font-bold text-maroon">€{product.price.toFixed(2)}</span>
							)}
						</div>
					</div>
				</motion.div>
			</Link>
			<QuickViewModal
				product={product}
				isOpen={showQuickView}
				onClose={() => setShowQuickView(false)}
			/>
		</motion.div>
	);
}


