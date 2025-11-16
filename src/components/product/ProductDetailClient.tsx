"use client";
import Image from "next/image";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine, UtensilsCrossed, Sparkles } from "lucide-react";

type ProductDetailClientProps = {
	product: Product;
	discountPercentage: number | null;
};

export function ProductDetailClient({ product, discountPercentage }: ProductDetailClientProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const images =
		product.images && product.images.length
			? [product.image, ...product.images.filter((u) => u !== product.image)]
			: [product.image];
	const [zoom, setZoom] = useState(false);
	const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

	return (
		<Container className="py-12">
			<SectionHeading>{product.name}</SectionHeading>
			<div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Sticky Image Gallery */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white shadow-lg flex items-center justify-center">
						{/* Badges - Top Left */}
						<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
							{product.onSale && discountPercentage && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide"
								>
									-{discountPercentage}%
								</motion.span>
							)}
							{product.new && (
								<motion.span
									initial={{ scale: 0, rotate: -12 }}
									animate={{ scale: 1, rotate: -12 }}
									className="rounded-md bg-gold px-3 py-1.5 text-sm font-bold text-maroon shadow-lg uppercase tracking-wide border-2 border-maroon/20"
								>
									NEW
								</motion.span>
							)}
						</div>
						
						{/* Premium floating shadow */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
						
						{/* Main Image with smooth fade */}
						<AnimatePresence mode="wait">
							<motion.div
								key={selectedImage}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="absolute inset-0"
							>
								<Image
									src={images[selectedImage]}
									alt={product.name}
									fill
									className={`object-contain p-6 transition-transform duration-200 ${
										zoom ? "cursor-zoom-out" : "cursor-zoom-in"
									}`}
									style={
										zoom
											? {
													transform: "scale(1.8)",
													transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
											  }
											: undefined
									}
									onClick={() => setZoom((z) => !z)}
									onMouseMove={(e: React.MouseEvent<HTMLImageElement>) => {
										if (!zoom) return;
										const rect = e.currentTarget.getBoundingClientRect();
										const x = ((e.clientX - rect.left) / rect.width) * 100;
										const y = ((e.clientY - rect.top) / rect.height) * 100;
										setZoomOrigin({ x, y });
									}}
									sizes="(max-width: 768px) 100vw, 50vw"
									priority
								/>
							</motion.div>
						</AnimatePresence>
						{images.length > 1 && (
							<>
								<button
									type="button"
									aria-label="Previous"
									onClick={() => {
										setSelectedImage((i) => (i - 1 + images.length) % images.length);
										setZoom(false);
									}}
									className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 border border-maroon/20 p-1 text-maroon hover:bg-white"
								>
									‹
								</button>
								<button
									type="button"
									aria-label="Next"
									onClick={() => {
										setSelectedImage((i) => (i + 1) % images.length);
										setZoom(false);
									}}
									className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 border border-maroon/20 p-1 text-maroon hover:bg-white"
								>
									›
								</button>
							</>
						)}
					</div>
					
					{/* Thumbnail Gallery */}
					{images.length > 1 && (
						<div className="mt-4 flex gap-2 overflow-x-auto pb-2">
							{images.map((img, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
										selectedImage === index
											? "border-gold shadow-md"
											: "border-maroon/20 hover:border-maroon/40"
									}`}
								>
									<Image
										src={img}
										alt={`${product.name} view ${index + 1}`}
										fill
										className="object-contain p-1"
										sizes="80px"
									/>
								</button>
							))}
						</div>
					)}
				</div>
				
				{/* Product Info */}
				<div>
					<p className="text-sm text-maroon/70">
						{product.category}
						{product.wineType ? ` • ${product.wineType}` : ""}
						{product.spiritType ? ` • ${product.spiritType}` : ""}
						{product.beerStyle ? ` • ${product.beerStyle}` : ""}
						{product.country ? ` • ${product.country}` : ""}
						{product.region ? ` • ${product.region}` : ""}
					</p>
					<div className="mt-4 flex items-center gap-3">
						{product.onSale && product.salePrice ? (
							<>
								<span className="text-3xl font-bold text-red-600">€{product.salePrice.toFixed(2)}</span>
								<span className="text-xl text-maroon/50 line-through">€{product.price.toFixed(2)}</span>
								{discountPercentage && (
									<span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
										-{discountPercentage}% OFF
									</span>
								)}
							</>
						) : (
							<span className="text-3xl font-bold text-maroon">€{product.price.toFixed(2)}</span>
						)}
					</div>
					
					{product.abv != null && (
						<p className="mt-4 text-sm text-maroon/70">
							<strong>ABV:</strong> {product.abv}%
						</p>
					)}
					{product.volumeMl && (
						<p className="text-sm text-maroon/70">
							<strong>Volume:</strong> {product.volumeMl} ml
						</p>
					)}
					
					<p className="mt-6 text-maroon/90 leading-relaxed text-lg whitespace-pre-line">
						{product.description}
					</p>
					
					{/* Producer / Tasting info */}
					{(product.producer || product.tasteProfile || product.foodPairing) && (
						<div className="mt-8 grid gap-6 pt-6 border-t border-maroon/10 sm:grid-cols-2 lg:grid-cols-3">
							{product.producer && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<Sparkles className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Producer</span>
									</div>
									<p className="text-sm text-maroon/80">{product.producer}</p>
								</div>
							)}
							{product.tasteProfile && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<Wine className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Tastes</span>
									</div>
									<p className="text-sm text-maroon/80 whitespace-pre-line">
										{product.tasteProfile}
									</p>
								</div>
							)}
							{product.foodPairing && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<UtensilsCrossed className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Food pairing</span>
									</div>
									<p className="text-sm text-maroon/80 whitespace-pre-line">
										{product.foodPairing}
									</p>
								</div>
							)}
						</div>
					)}
					
					<div className="mt-8">
						<AddToCartButton product={product} variant="large" />
					</div>
				</div>
			</div>
		</Container>
	);
}

